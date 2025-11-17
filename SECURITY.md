# Security Features

This document outlines the security measures implemented to protect the admin interface.

## Authentication & Authorization

### Secure Session Management
- **HTTP-only cookies**: Session tokens cannot be accessed via JavaScript
- **Secure flag**: Cookies only transmitted over HTTPS in production
- **SameSite strict**: Prevents CSRF attacks
- **64-character random tokens**: Cryptographically secure session identifiers
- **7-day expiration**: Sessions automatically expire after one week

### Password Security
- **PBKDF2 hashing**: Passwords hashed with 100,000 iterations
- **Salted hashes**: Each password uses a unique random salt
- **Legacy support**: System supports both plain text and hashed passwords for migration
- **Password hashing utility**: Use `node scripts/hash-password.js` to generate secure hashes

## Attack Prevention

### Rate Limiting
- **5 failed attempts per 15 minutes**: Prevents brute force attacks
- **1-hour lockout**: IP blocked for 1 hour after exceeding limit
- **Per-IP tracking**: Each client IP tracked independently
- **Countdown timer**: Login page shows remaining lockout time
- **Automatic cleanup**: Old rate limit entries automatically purged

### Input Validation & Sanitization
- **Type checking**: All inputs validated for correct data types
- **Length limits**: Password input limited to 256 characters
- **Request validation**: Malformed requests rejected immediately
- **Error handling**: Generic error messages prevent information leakage

### Timing Attack Prevention
- **Artificial delay**: 1-second delay on failed login attempts
- **Constant-time comparison**: Password verification resistant to timing attacks
- **Rate limit reset**: Successful login resets rate limit counter

### Cross-Site Scripting (XSS) Protection
- **X-XSS-Protection header**: Browser XSS filtering enabled
- **Content Security Policy**: Strict CSP prevents inline script execution
- **Input sanitization**: All user inputs validated and sanitized

### Cross-Site Request Forgery (CSRF) Protection
- **SameSite strict cookies**: Prevents cross-origin cookie sending
- **Origin validation**: Request origins validated server-side
- **Secure session tokens**: Unpredictable session identifiers

### Clickjacking Protection
- **X-Frame-Options: DENY**: Prevents embedding in iframes
- **frame-ancestors 'none'**: CSP prevents framing attempts

## Security Headers

### Global Headers (via Middleware)
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy: (strict policy defined)
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload (production)
```

### Content Security Policy
- Default sources limited to self
- Scripts: self + inline (for Next.js)
- Styles: self + inline + Google Fonts
- Images: self + data URIs + HTTPS
- Media: self + blob + HTTPS
- Connections: self + YouTube API
- Frames: YouTube only
- Objects: blocked
- Base URI: self only
- Forms: self only
- No frame ancestors

## Route Protection

### Middleware Protection
- All `/admin/*` routes protected (except `/admin/login`)
- Session validation on every request
- Automatic redirect to login for unauthenticated users
- Session token format validation (64-character hex)

### API Endpoint Protection
- Authentication check on sensitive endpoints
- Rate limiting on login endpoint
- Security headers on all API responses
- Input validation on all requests

## Best Practices

### Password Management
1. **Never commit passwords to git**
2. **Use strong passwords** (minimum 12 characters recommended)
3. **Hash passwords** using the provided script:
   ```bash
   node scripts/hash-password.js
   ```
4. **Rotate passwords regularly**
5. **Use different passwords** for different environments

### Environment Variables
```env
# Use hashed password (recommended)
ADMIN_PASSWORD=a1b2c3d4e5f6...:e7f8g9h0i1j2...

# Or plain text (legacy, less secure)
ADMIN_PASSWORD=your_secure_password_here
```

### Deployment Checklist
- [ ] Change default admin password
- [ ] Hash the admin password
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS headers
- [ ] Set NODE_ENV=production
- [ ] Review and test rate limiting
- [ ] Monitor failed login attempts
- [ ] Set up logging and alerting

## Security Monitoring

### What to Monitor
- Failed login attempts per IP
- Rate limit violations
- Session token validation failures
- Unusual access patterns
- API endpoint errors

### Logging
All authentication events are logged with:
- Timestamp
- Client IP address
- Action performed
- Success/failure status
- Error messages (if any)

## Incident Response

### In Case of Security Breach
1. **Immediately change admin password**
2. **Clear all active sessions**:
   ```bash
   # Restart the application to clear all sessions
   docker compose restart
   ```
3. **Review server logs** for suspicious activity
4. **Check rate limiter** for blocked IPs
5. **Analyze failed login attempts**
6. **Update credentials** in all environments

### Rate Limit Reset
If legitimate user gets rate limited:
1. Wait for the 1-hour timeout to expire
2. Or restart the application to clear rate limits:
   ```bash
   docker compose restart
   ```

## Security Updates

### Regular Maintenance
- Keep dependencies updated
- Review security advisories
- Update Node.js and Next.js
- Audit npm packages regularly
- Monitor for CVEs

### Dependency Scanning
```bash
npm audit
npm audit fix
```

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Contact

Report security vulnerabilities responsibly. Do not create public GitHub issues for security problems.
