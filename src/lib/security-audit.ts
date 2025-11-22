type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGIN_RATE_LIMITED'
  | 'SESSION_HIJACK_ATTEMPT'
  | 'INVALID_CSRF_TOKEN'
  | 'LOGOUT'
  | 'UNAUTHORIZED_ACCESS';

interface SecurityEvent {
  type: SecurityEventType;
  timestamp: number;
  ip: string;
  userAgent: string;
  details?: Record<string, any>;
}

class SecurityAuditLogger {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 1000;

  /**
   * Log a security event
   */
  log(
    type: SecurityEventType,
    ip: string,
    userAgent: string,
    details?: Record<string, any>
  ): void {
    const event: SecurityEvent = {
      type,
      timestamp: Date.now(),
      ip,
      userAgent,
      details,
    };

    this.events.push(event);

    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Log to console for monitoring (in production, send to logging service)
    const logLevel = this.getLogLevel(type);
    const message = this.formatLogMessage(event);

    if (logLevel === 'error') {
      console.error(message);
    } else if (logLevel === 'warn') {
      console.warn(message);
    } else {
      console.log(message);
    }
  }

  /**
   * Get recent security events (for monitoring dashboard)
   */
  getRecentEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Get events by type
   */
  getEventsByType(type: SecurityEventType): SecurityEvent[] {
    return this.events.filter((event) => event.type === type);
  }

  /**
   * Get failed login attempts for an IP
   */
  getFailedLoginAttempts(ip: string, since: number): number {
    return this.events.filter(
      (event) =>
        event.type === 'LOGIN_FAILURE' &&
        event.ip === ip &&
        event.timestamp >= since
    ).length;
  }

  /**
   * Determine log level based on event type
   */
  private getLogLevel(type: SecurityEventType): 'info' | 'warn' | 'error' {
    const errorEvents: SecurityEventType[] = ['SESSION_HIJACK_ATTEMPT'];
    const warnEvents: SecurityEventType[] = [
      'LOGIN_FAILURE',
      'LOGIN_RATE_LIMITED',
      'INVALID_CSRF_TOKEN',
      'UNAUTHORIZED_ACCESS',
    ];

    if (errorEvents.includes(type)) {
      return 'error';
    } else if (warnEvents.includes(type)) {
      return 'warn';
    }
    return 'info';
  }

  /**
   * Format log message for output
   */
  private formatLogMessage(event: SecurityEvent): string {
    const timestamp = new Date(event.timestamp).toISOString();
    const ipMasked = this.maskIp(event.ip);
    const detailsStr = event.details ? ` | ${JSON.stringify(event.details)}` : '';

    return `[SECURITY] ${timestamp} | ${event.type} | IP: ${ipMasked}${detailsStr}`;
  }

  /**
   * Mask IP for privacy compliance (GDPR)
   */
  private maskIp(ip: string): string {
    if (ip === 'unknown') {
      return ip;
    }

    const parts = ip.split('.');
    if (parts.length === 4) {
      // IPv4: mask last octet
      return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
    }

    // IPv6: mask last part
    const v6Parts = ip.split(':');
    if (v6Parts.length > 1) {
      return `${v6Parts.slice(0, -1).join(':')}:***`;
    }

    return '***';
  }
}

export const securityAudit = new SecurityAuditLogger();
