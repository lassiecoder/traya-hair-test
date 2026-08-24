/**
 * Static DM Sans weight instances (generated from Google's variable font).
 * Custom fonts on RN are looked up by exact family name, so components
 * reference these directly instead of using `fontWeight`.
 */
export const fontFamily = {
  regular: 'DMSans-Regular',
  medium: 'DMSans-Medium',
  bold: 'DMSans-Bold',
  extraBold: 'DMSans-ExtraBold',
} as const;

/**
 * Named text styles for the app's type scale. Screens/components spread
 * these instead of repeating font sizes and weights inline.
 */
export const textStyles = {
  /** Page/section headings, e.g. "First, let's set up your profile." */
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.56, // -2% of 28px
  },
  body: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 21,
  },
  label: {
    fontFamily: fontFamily.extraBold,
    fontSize: 14,
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
  },
  captionEmphasis: {
    fontFamily: fontFamily.extraBold,
    fontSize: 12,
  },
  cta: {
    fontFamily: fontFamily.extraBold,
    fontSize: 20,
  },
} as const;
