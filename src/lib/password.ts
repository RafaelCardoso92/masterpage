import crypto from 'crypto';

/**
 * Hash a password using PBKDF2
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hashed password
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    const [salt, originalHash] = hashedPassword.split(':');
    if (!salt || !originalHash) {
      return false;
    }
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  } catch (error) {
    return false;
  }
}

/**
 * Check if password is hashed (contains colon separator)
 */
export function isPasswordHashed(password: string): boolean {
  return password.includes(':') && password.split(':').length === 2;
}
