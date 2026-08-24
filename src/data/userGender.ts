import {Gender} from '../types/user';

export type IconGender = 'male' | 'female';

/**
 * Maps the gender picked at signup to which gendered icon set (scalp diagrams, density-map
 * illustrations) to show. "Prefer not to say" and no gender on record (e.g. the dev skip
 * button) both fall back to 'female', matching the reference design's default.
 */
export function resolveIconGender(gender: Gender | null | undefined): IconGender {
  return gender === 'Male' ? 'male' : 'female';
}
