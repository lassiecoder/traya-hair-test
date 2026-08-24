const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_PATTERN = /^[A-Za-z][A-Za-z\s'-]*$/;

/** Strips characters a full name can't contain, as the user types. */
export function sanitizeFullName(value: string): string {
  return value.replace(/[^A-Za-z\s'-]/g, '');
}

/** Emails never contain whitespace — strip it as the user types. */
export function sanitizeEmail(value: string): string {
  return value.replace(/\s/g, '');
}

export function validateFullName(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return 'Enter your full name';
  }
  if (trimmed.length < 2) {
    return 'Full name is too short';
  }
  if (!NAME_PATTERN.test(trimmed)) {
    return 'Full name can only contain letters';
  }
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return 'Enter your email address';
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address';
  }
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (value.length === 0) {
    return 'Enter a password';
  }
  if (value.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return undefined;
}

export function validateGender(value: string | null): string | undefined {
  if (!value) {
    return 'Select your gender';
  }
  return undefined;
}
