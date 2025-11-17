import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { rateLimiter } from '@/lib/rate-limiter';
import { verifyPassword, isPasswordHashed } from '@/lib/password';

const SESSION_COOKIE = 'admin_session';

// Generate a secure session token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Get client IP from request
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

// Add security headers to response
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

// POST /api/admin/auth - Login
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Check rate limit
    const { allowed, retryAfter } = rateLimiter.check(clientIp);
    if (!allowed) {
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
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return addSecurityHeaders(
        NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      );
    }

    // Input sanitization - limit password length
    if (password.length > 256) {
      return addSecurityHeaders(
        NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return addSecurityHeaders(
        NextResponse.json({ error: 'Admin password not configured' }, { status: 500 })
      );
    }

    // Verify password (supports both hashed and plain text for migration)
    let isValid = false;
    if (isPasswordHashed(adminPassword)) {
      isValid = verifyPassword(password, adminPassword);
    } else {
      // Plain text comparison (legacy support)
      isValid = password === adminPassword;
    }

    if (isValid) {
      // Reset rate limiter on successful login
      rateLimiter.reset(clientIp);

      const sessionToken = generateSessionToken();
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

      // Add delay to slow down brute force attempts
      await new Promise(resolve => setTimeout(resolve, 1000));

      return addSecurityHeaders(
        NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return addSecurityHeaders(
      NextResponse.json({ error: 'Login failed' }, { status: 500 })
    );
  }
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return addSecurityHeaders(response);
}

// GET /api/admin/auth - Check authentication status
export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  // Check if session token exists and is valid format
  const isAuthenticated = session?.value && session.value.length === 64;

  if (isAuthenticated) {
    return addSecurityHeaders(NextResponse.json({ authenticated: true }));
  } else {
    return addSecurityHeaders(NextResponse.json({ authenticated: false }));
  }
}
