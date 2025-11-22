import { NextResponse } from 'next/server';
import { csrfManager } from '@/lib/csrf';

// GET /api/admin/csrf - Get CSRF token for login
export async function GET() {
  const csrfToken = csrfManager.generateToken();

  const response = NextResponse.json({ csrfToken });

  // Set CSRF token in cookie
  response.cookies.set('csrf_token', csrfToken, {
    httpOnly: false, // Client needs to read this
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  return response;
}
