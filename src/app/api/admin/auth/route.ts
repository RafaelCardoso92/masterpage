import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { rateLimiter } from '@/lib/rate-limiter';
import { verifyPassword, isPasswordHashed } from '@/lib/password';
import { sessionManager } from '@/lib/session-manager';
import { csrfManager } from '@/lib/csrf';
import { securityAudit } from '@/lib/security-audit';

const SESSION_COOKIE = 'admin_session';
const CSRF_COOKIE = 'csrf_token';

// Get client IP from request
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

// Get User-Agent from request
function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

// Add security headers to response
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none';");
  return response;
}

// POST /api/admin/auth - Login
export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const userAgent = getUserAgent(request);

  try {
    // Check rate limit
    const { allowed, retryAfter } = rateLimiter.check(clientIp);
    if (!allowed) {
      securityAudit.log('LOGIN_RATE_LIMITED', clientIp, userAgent, { retryAfter });

      const response = NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter
        },
        { status: 429 }
      );
      response.headers.set('Retry-After', retryAfter?.toString() || '3600');
      return addSecurityHeaders(response);
    }

    // Validate input
    const body = await request.json();
    const { password, csrfToken } = body;

    // Validate CSRF token
    if (!csrfManager.validateToken(csrfToken)) {
      securityAudit.log('INVALID_CSRF_TOKEN', clientIp, userAgent);
      return addSecurityHeaders(
        NextResponse.json({ error: 'Invalid request' }, { status: 403 })
      );
    }

    if (!password || typeof password !== 'string') {
      return addSecurityHeaders(
        NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      );
    }

    // Input sanitization - limit password length
    if (password.length > 256) {
      securityAudit.log('LOGIN_FAILURE', clientIp, userAgent, { reason: 'password_too_long' });
      return addSecurityHeaders(
        NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable not set');
      return addSecurityHeaders(
        NextResponse.json({ error: 'Admin password not configured' }, { status: 500 })
      );
    }

    // Verify password - ONLY support hashed passwords for security
    let isValid = false;
    if (isPasswordHashed(adminPassword)) {
      isValid = verifyPassword(password, adminPassword);
    } else {
      // Log warning about plain text password
      console.error('WARNING: ADMIN_PASSWORD is not hashed. Please hash your password using the hashPassword utility.');
      securityAudit.log('LOGIN_FAILURE', clientIp, userAgent, { reason: 'unhashed_admin_password' });
      return addSecurityHeaders(
        NextResponse.json({ error: 'Server configuration error. Please contact administrator.' }, { status: 500 })
      );
    }

    if (isValid) {
      // Reset rate limiter on successful login
      rateLimiter.reset(clientIp);

      // Create session
      const sessionToken = sessionManager.createSession(clientIp, userAgent);

      securityAudit.log('LOGIN_SUCCESS', clientIp, userAgent);

      const response = NextResponse.json({ success: true });

      // Set session cookie (expires in 7 days)
      response.cookies.set(SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return addSecurityHeaders(response);
    } else {
      // Record failed attempt
      rateLimiter.recordFailure(clientIp);

      securityAudit.log('LOGIN_FAILURE', clientIp, userAgent, { reason: 'invalid_password' });

      // Add delay to slow down brute force attempts
      await new Promise(resolve => setTimeout(resolve, 1000));

      return addSecurityHeaders(
        NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    securityAudit.log('LOGIN_FAILURE', clientIp, userAgent, { reason: 'exception', error: String(error) });
    return addSecurityHeaders(
      NextResponse.json({ error: 'Login failed' }, { status: 500 })
    );
  }
}

// DELETE /api/admin/auth - Logout
export async function DELETE(request: NextRequest) {
  const clientIp = getClientIp(request);
  const userAgent = getUserAgent(request);
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (session?.value) {
    sessionManager.revokeSession(session.value);
    securityAudit.log('LOGOUT', clientIp, userAgent);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return addSecurityHeaders(response);
}

// GET /api/admin/auth - Check authentication status
export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const userAgent = getUserAgent(request);
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  // Validate session with security checks
  const isAuthenticated = sessionManager.validateSession(
    session?.value,
    clientIp,
    userAgent
  );

  if (isAuthenticated) {
    // Generate new CSRF token for authenticated requests
    const csrfToken = csrfManager.generateToken();

    const response = NextResponse.json({
      authenticated: true,
      csrfToken
    });

    // Set CSRF token in cookie for client access
    response.cookies.set(CSRF_COOKIE, csrfToken, {
      httpOnly: false, // Client needs to read this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return addSecurityHeaders(response);
  } else {
    if (session?.value) {
      // Session exists but invalid - potential hijacking attempt
      securityAudit.log('UNAUTHORIZED_ACCESS', clientIp, userAgent, {
        reason: 'invalid_session'
      });
    }

    return addSecurityHeaders(NextResponse.json({ authenticated: false }));
  }
}
