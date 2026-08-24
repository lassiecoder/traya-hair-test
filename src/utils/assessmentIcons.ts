import {ImageSourcePropType} from 'react-native';
import {IconGender} from '../data/userGender';
import {AssessmentOption} from '../types/assessment';

/** Resolves an option's default-state icon, picking the gendered variant when present. */
export function resolveOptionIcon(
  option: AssessmentOption,
  iconGender: IconGender,
): ImageSourcePropType | undefined {
  return option.genderedIcon ? option.genderedIcon[iconGender] : option.icon;
}

/** Resolves an option's selected-state icon, picking the gendered variant when present. */
export function resolveOptionSelectedIcon(
  option: AssessmentOption,
  iconGender: IconGender,
): ImageSourcePropType | undefined {
  return option.genderedSelectedIcon ? option.genderedSelectedIcon[iconGender] : option.selectedIcon;
}
