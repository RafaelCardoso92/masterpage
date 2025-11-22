import crypto from 'crypto';

interface Session {
  token: string;
  createdAt: number;
  expiresAt: number;
  ip: string;
  userAgent: string;
}

class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private readonly sessionDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly cleanupInterval = 60 * 60 * 1000; // 1 hour

  constructor() {
    // Periodic cleanup of expired sessions
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), this.cleanupInterval);
    }
  }

  /**
   * Generate a cryptographically secure session token
   */
  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create a new session
   */
  createSession(ip: string, userAgent: string): string {
    const token = this.generateToken();
    const now = Date.now();

    this.sessions.set(token, {
      token,
      createdAt: now,
      expiresAt: now + this.sessionDuration,
      ip,
      userAgent,
    });

    return token;
  }

  /**
   * Validate a session token with security checks
   */
  validateSession(
    token: string | undefined,
    ip: string,
    userAgent: string
  ): boolean {
    if (!token || typeof token !== 'string' || token.length !== 64) {
      return false;
    }

    const session = this.sessions.get(token);

    if (!session) {
      return false;
    }

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(token);
      return false;
    }

    // Validate IP and user agent to prevent session hijacking
    if (session.ip !== ip || session.userAgent !== userAgent) {
      // Security event: potential session hijacking
      console.warn('Session validation failed: IP or User-Agent mismatch', {
        sessionIp: session.ip,
        requestIp: ip,
        tokenPrefix: token.substring(0, 8),
      });
      this.sessions.delete(token);
      return false;
    }

    return true;
  }

  /**
   * Revoke a session (logout)
   */
  revokeSession(token: string): void {
    this.sessions.delete(token);
  }

  /**
   * Revoke all sessions for cleanup
   */
  revokeAllSessions(): void {
    this.sessions.clear();
  }

  /**
   * Clean up expired sessions
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [token, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(token);
      }
    }
  }

  /**
   * Get session count (for monitoring)
   */
  getSessionCount(): number {
    return this.sessions.size;
  }
}

export const sessionManager = new SessionManager();
