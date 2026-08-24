export type Gender = 'Male' | 'Female' | 'Prefer not to say';

export interface SignUpFormData {
  fullName: string;
  gender: Gender | null;
}
