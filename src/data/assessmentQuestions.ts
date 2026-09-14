import { AssessmentQuestion } from '../types/assessment';

/** The progress bar/counter always reflects this, independent of how many questions are filled in below. */
export const TOTAL_ASSESSMENT_QUESTIONS = 11;

/**
 * Groups the 11 questions below into labeled sections for the segmented progress bar —
 * purely a display grouping, doesn't affect answer collection or question order.
 */
export const ASSESSMENT_SECTIONS: { label: string; questionCount: number }[] = [
  { label: 'Hair basics', questionCount: 3 }, // hair-goal, age, hair-texture
  { label: 'Hair & scalp', questionCount: 3 }, // shedding-amount, parting, oil-timing
  { label: 'Lifestyle', questionCount: 2 }, // stress-level, sleep-quality
  { label: 'Health & diet', questionCount: 3 }, // health-history, medical-conditions, diet
];

export const ASSESSMENT_SECTION_LENGTHS = ASSESSMENT_SECTIONS.map(
  section => section.questionCount,
);

/** Maps a 1-based overall question number to its section label and position within that section. */
export function getSectionProgress(questionNumber: number): {
  sectionLabel: string;
  positionInSection: number;
  sectionLength: number;
} {
  let answeredBefore = 0;
  for (const section of ASSESSMENT_SECTIONS) {
    if (questionNumber <= answeredBefore + section.questionCount) {
      return {
        sectionLabel: section.label,
        positionInSection: questionNumber - answeredBefore,
        sectionLength: section.questionCount,
      };
    }
    answeredBefore += section.questionCount;
  }
  const lastSection = ASSESSMENT_SECTIONS[ASSESSMENT_SECTIONS.length - 1];
  return {
    sectionLabel: lastSection.label,
    positionInSection: lastSection.questionCount,
    sectionLength: lastSection.questionCount,
  };
}

/**
 * All 11 questions' copy has been shared. Only the option `icon`/`selectedIcon`
 * assets are still outstanding for a few of the later questions.
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'hair-goal',
    type: 'choice',
    variant: 'photo',
    title: 'What do you want your hair to do?',
    subtitle: 'This sets what your plan optimizes for first.',
    options: [
      {
        id: 'stop-the-fall',
        title: 'Stop the fall',
        description: 'Reduce daily shedding',
        icon: require('../../assets/images/stopthefall.png'),
      },
      {
        id: 'regrow-density',
        title: 'Regrow density',
        description: 'Filling thinning zones',
        icon: require('../../assets/images/regrowdensity.png'),
      },
      {
        id: 'repair-quality',
        title: 'Repair quality',
        description: 'Frizz, dryness, breakage',
        icon: require('../../assets/images/repairquality.png'),
      },
    ],
  },
  {
    id: 'age',
    type: 'age',
    title: 'How old are you?',
    subtitle: 'Loss patterns and dosing both shift with age.',
    minAge: 13,
    maxAge: 90,
    defaultAge: 16,
  },
  {
    id: 'hair-texture',
    type: 'choice',
    variant: 'photoGrid',
    title: 'What does your hair look like naturally?',
    subtitle: 'Untreated, no straightening, coloring or perming.',
    options: [
      {
        id: 'straight-hair',
        title: 'Straight hair',
        icon: require('../../assets/images/straighthair.png'),
      },
      {
        id: 'wavy-hair',
        title: 'Wavy hair',
        icon: require('../../assets/images/wavy.png'),
      },
      {
        id: 'curly-hair',
        title: 'Curly hair',
        icon: require('../../assets/images/curlyhair.png'),
      },
      {
        id: 'coily-hair',
        title: 'Coily hair',
        icon: require('../../assets/images/coilyhair.png'),
      },
    ],
  },
  {
    id: 'shedding-amount',
    type: 'choice',
    variant: 'checkbox',
    title: 'How much hair are you losing?',
    subtitle: 'Between 50 and 100 strands a day is normal.',
    options: [
      {
        id: 'about-normal',
        title: 'About normal',
        description: 'A few strands, nothing new',
      },
      {
        id: 'more-than-usual',
        title: 'More than usual',
        description: 'Noticeable on the pillow',
      },
      { id: 'clumps', title: 'Clumps', description: 'Handful in the shower' },
      { id: 'not-sure', title: 'Not sure', description: 'Hard to tell' },
    ],
  },
  {
    id: 'parting',
    type: 'choice',
    variant: 'photoGrid',
    photoAspectRatio: 136 / 170,
    title: 'Which parting looks most like yours?',
    subtitle:
      'Part your hair and check a mirror, more visible scalp means a later stage.',
    options: [
      {
        id: 'even-parting',
        title: 'Even parting',
        icon: require('../../assets/images/evenparting.png'),
      },
      {
        id: 'widening-parting',
        title: 'Widening parting',
        icon: require('../../assets/images/wideningparting.png'),
      },
      {
        id: 'advanced-widening',
        title: 'Advanced widening',
        icon: require('../../assets/images/advancedparting.png'),
      },
      {
        id: 'diffuse-thinning',
        title: 'Diffuse thinning',
        icon: require('../../assets/images/diffuseparting.png'),
      },
      {
        id: 'coin-size-patch',
        title: 'Coin size patch',
        icon: require('../../assets/images/coinsizepatch.png'),
      },
    ],
  },
  {
    id: 'oil-timing',
    type: 'choice',
    variant: 'checkbox',
    title: 'How soon does your scalp feel oily after a wash?',
    subtitle: 'Sebum turnover tells us how your scalp barrier is behaving.',
    options: [
      { id: 'within-24-hours', title: 'Within 24 hours' },
      // Reference mock's 2nd option was "More than usual" (a mislabel carried over
      // from the shedding-amount question) — swapped for the duration this question
      // is actually asking for, filling the gap between the two other options.
      { id: '2-3-days', title: '2–3 days' },
      { id: '4-days-or-more', title: '4 days or more' },
      { id: 'stays-dry', title: 'It stays dry' },
    ],
  },
  {
    id: 'stress-level',
    type: 'choice',
    variant: 'checkbox',
    title: 'How stressed have you been this year?',
    subtitle: 'Cortisol pushes follicles into the resting phase early.',
    note: 'Stress is a contributing factor in more than 60% of diagnosed telogen effluvium.',
    options: [
      { id: 'not-at-all', title: 'Not at all' },
      { id: 'low', title: 'Low' },
      { id: 'moderate', title: 'Moderate' },
      { id: 'high', title: 'High' },
    ],
  },
  {
    id: 'sleep-quality',
    type: 'choice',
    variant: 'checkbox',
    title: 'How do you sleep?',
    subtitle: 'Melatonin and cortisol are both set overnight.',
    options: [
      { id: 'deeply-7-8-hours', title: 'Deeply, 7–8 hours' },
      { id: 'wake-once-or-twice', title: 'I wake once or twice' },
      { id: 'struggle-to-fall-asleep', title: 'I struggle to fall asleep' },
      { id: 'under-5-hours', title: 'Under 5 hours' },
    ],
  },
  {
    id: 'health-history',
    type: 'choice',
    variant: 'checkbox',
    multiSelect: true,
    title: 'Has your body been through any of these?',
    subtitle: 'Select everything that applies in the last 12 months.',
    options: [
      { id: 'none-of-these', title: 'None of these', exclusive: true },
      { id: 'thyroid', title: 'Thyroid' },
      { id: 'anemia-low-haemoglobin', title: 'Anemia or low haemoglobin' },
      { id: 'severe-illness-or-surgery', title: 'Severe illness or surgery' },
      { id: 'pcos-hormonal-imbalance', title: 'PCOS or hormonal imbalance' },
      { id: 'pregnancy-post-partum', title: 'Pregnancy or post-partum' },
    ],
  },
  {
    id: 'medical-conditions',
    type: 'choice',
    variant: 'checkbox',
    multiSelect: true,
    title: 'Any medical conditions we should know about?',
    subtitle: 'We check this so every ingredient in your plan is safe for you.',
    note: 'An answer here can remove a supplement from your kit entirely.',
    options: [
      { id: 'none-of-these', title: 'None of these', exclusive: true },
      { id: 'high-blood-pressure', title: 'High blood pressure' },
      { id: 'low-blood-pressure', title: 'Low blood pressure' },
      { id: 'liver-condition', title: 'Liver condition' },
      { id: 'cardiovascular-disorder', title: 'Cardiovascular disorder' },
      { id: 'on-prescription-medicine', title: 'On prescription medicine' },
    ],
  },
  {
    id: 'diet',
    type: 'choice',
    variant: 'checkbox',
    title: 'How would you describe your diet?',
    subtitle: 'Your diet plan and your capsule base both depend on this.',
    options: [
      { id: 'vegetarian', title: 'Vegetarian' },
      { id: 'vegan', title: 'Vegan' },
      { id: 'eggetarian', title: 'Eggetarian' },
      { id: 'non-vegetarian', title: 'Non-vegetarian' },
    ],
  },
];
