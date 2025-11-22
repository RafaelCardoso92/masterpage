import crypto from 'crypto';

interface CSRFToken {
  token: string;
  createdAt: number;
  expiresAt: number;
}

class CSRFManager {
  private tokens: Map<string, CSRFToken> = new Map();
  private readonly tokenDuration = 60 * 60 * 1000; // 1 hour
  private readonly cleanupInterval = 15 * 60 * 1000; // 15 minutes

  constructor() {
    // Periodic cleanup of expired tokens
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), this.cleanupInterval);
    }
  }

  /**
   * Generate a new CSRF token
   */
  generateToken(): string {
    const token = crypto.randomBytes(32).toString('hex');
    const now = Date.now();

    this.tokens.set(token, {
      token,
      createdAt: now,
      expiresAt: now + this.tokenDuration,
    });

    // Limit stored tokens to prevent memory issues
    if (this.tokens.size > 10000) {
      this.cleanup();
    }

    return token;
  }

  /**
   * Validate and consume a CSRF token (one-time use)
   */
  validateToken(token: string | undefined): boolean {
    if (!token || typeof token !== 'string' || token.length !== 64) {
      return false;
    }

    const csrfToken = this.tokens.get(token);

    if (!csrfToken) {
      return false;
    }

    // Check if token is expired
    if (Date.now() > csrfToken.expiresAt) {
      this.tokens.delete(token);
      return false;
    }

    // Consume token (one-time use)
    this.tokens.delete(token);
    return true;
  }

  /**
   * Clean up expired tokens
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [token, csrfToken] of this.tokens.entries()) {
      if (now > csrfToken.expiresAt) {
        this.tokens.delete(token);
      }
    }
  }
}

export const csrfManager = new CSRFManager();
