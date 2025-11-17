interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly blockDurationMs = 60 * 60 * 1000; // 1 hour

  check(identifier: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    // Clean up old entries periodically
    this.cleanup();

    if (!entry) {
      // First attempt
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now,
      });
      return { allowed: true };
    }

    // Check if currently blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
      return { allowed: false, retryAfter };
    }

    // Reset if window has passed
    if (now - entry.firstAttempt > this.windowMs) {
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now,
      });
      return { allowed: true };
    }

    // Increment attempt count
    entry.count++;

    // Block if max attempts reached
    if (entry.count > this.maxAttempts) {
      entry.blockedUntil = now + this.blockDurationMs;
      const retryAfter = Math.ceil(this.blockDurationMs / 1000);
      return { allowed: false, retryAfter };
    }

    return { allowed: true };
  }

  recordFailure(identifier: string): void {
    const entry = this.attempts.get(identifier);
    if (entry) {
      entry.count++;
    }
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      // Remove entries older than window and not blocked
      if (
        now - entry.firstAttempt > this.windowMs &&
        (!entry.blockedUntil || entry.blockedUntil < now)
      ) {
        this.attempts.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();
