import {ImageSourcePropType} from 'react-native';

export interface GenderedIconSet {
  male: ImageSourcePropType;
  female: ImageSourcePropType;
}

export interface AssessmentOption {
  id: string;
  title: string;
  description?: string;
  icon?: ImageSourcePropType;
  /** Light-colored variant shown while this option is selected. */
  selectedIcon?: ImageSourcePropType;
  /** Used instead of `icon` when the artwork differs by gender (e.g. head/scalp diagrams). */
  genderedIcon?: GenderedIconSet;
  /** Used instead of `selectedIcon` when the artwork differs by gender. */
  genderedSelectedIcon?: GenderedIconSet;
  /** Multi-select only: picking this clears every other selection, and picking anything else clears this (e.g. "None of these"). */
  exclusive?: boolean;
}

interface AssessmentQuestionBase {
  id: string;
  title: string;
  subtitle: string;
  /** Optional callout shown below the options, e.g. "An answer here can remove a supplement from your kit entirely." */
  note?: string;
}

/** Tap-a-card question, e.g. "What do you want your hair to do?" */
export interface ChoiceAssessmentQuestion extends AssessmentQuestionBase {
  type: 'choice';
  /**
   * 'fill' (default): single-column card sweeps to a solid selected color, icon crossfades.
   * 'checkbox': static card with a checkbox indicator, e.g. "How much hair are you losing?"
   * 'grid': two-column cards, icon above title, same fill-select behavior as 'fill'.
   * 'photo': single-column card with a large cover-cropped photo, e.g. "What do you want your hair to do?"
   * 'photoGrid': two-column cards, title above a large cover-cropped photo, e.g. "What does your hair look like naturally?"
   */
  variant?: 'fill' | 'checkbox' | 'grid' | 'photo' | 'photoGrid';
  /** 'photoGrid' only: aspect ratio (width / height) of each option's photo — defaults to a square. */
  photoAspectRatio?: number;
  /** Allows picking multiple options at once; shows a Continue button instead of auto-advancing on tap. */
  multiSelect?: boolean;
  options: AssessmentOption[];
}

/** Scrollable ruler question, e.g. "How old are you?" */
export interface AgeAssessmentQuestion extends AssessmentQuestionBase {
  type: 'age';
  minAge: number;
  maxAge: number;
  defaultAge: number;
}

export type AssessmentQuestion = ChoiceAssessmentQuestion | AgeAssessmentQuestion;
