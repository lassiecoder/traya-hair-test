import {Gender} from '../types/user';

export interface SignUpPayload {
  fullName: string;
  gender: Gender;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResult {
  userId: string;
  fullName: string;
  // Only signIn collects an email (signUp now only asks for name/gender) — optional so one
  // result type can represent either.
  email?: string;
  // Only signUp collects gender — used to pick which gendered icon set the assessment/report
  // screens show.
  gender?: Gender;
}

/**
 * Stand-in auth service. SignUpScreen/LoginScreen only depend on these two
 * function signatures, so swapping in a real backend (Firebase, Supabase,
 * etc.) later means rewriting the bodies below — no screen changes needed.
 */
export async function signUp(payload: SignUpPayload): Promise<AuthResult> {
  return {
    userId: `local-${Date.now()}`,
    fullName: payload.fullName,
    gender: payload.gender,
  };
}

export async function signIn(payload: SignInPayload): Promise<AuthResult> {
  return {
    userId: `local-${Date.now()}`,
    fullName: 'Traya User',
    email: payload.email,
  };
}
