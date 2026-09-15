import {Platform} from 'react-native';
import {colors} from './colors';

/**
 * Shared elevation presets. iOS uses the shadow* properties (tinted with `colors.shadow`
 * instead of plain black, so depth reads as part of the brand); Android has no equivalent
 * shadow-tinting, so it falls back to plain `elevation`.
 */
export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    android: {elevation: 2},
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.14,
      shadowRadius: 14,
    },
    android: {elevation: 6},
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: {width: 0, height: 10},
      shadowOpacity: 0.18,
      shadowRadius: 22,
    },
    android: {elevation: 10},
    default: {},
  }),
} as const;
