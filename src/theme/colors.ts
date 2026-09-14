export const colors = {
  background: '#DCE8D5',
  primary: '#173F35',
  onPrimary: '#FFFFFF',
  textPrimary: '#173F35',
  textMuted: 'rgba(23, 63, 53, 0.55)',
  placeholder: 'rgba(23, 63, 53, 0.4)',
  inputBackground: '#C7D2BC',
  divider: 'rgba(23, 63, 53, 0.18)',
  overlay: 'rgba(23, 63, 53, 0.35)',
  error: '#B3261E',
  /** Icon-badge fills — a soft tint of `primary`, not a new hue. */
  primarySoft: 'rgba(23, 63, 53, 0.08)',
  /** Mid-tone fills for gauges/secondary bars — a stronger tint of `primary`. */
  primaryMuted: 'rgba(23, 63, 53, 0.45)',
  /** Shared shadowColor — every shadow in the app is primary-tinted, see theme/shadow.ts. */
  shadow: '#173F35',
  /** Names the value AssessmentNote already used as a hardcoded string. */
  noteBackground: '#57654F',
  /** `inputBackground` blended ~6% toward `primary` — selected-card fill, still in-palette. */
  inputBackgroundSelected: '#BCC9B4',
  /** Brighter, more saturated green — same hue family as `primary`, used only as the gradient's leading tip on the progress bar's in-progress segment. */
  progressActiveEnd: '#3FAE72',
} as const;
