import { AssessmentQuestion } from '../types/assessment';

/** The progress bar/counter always reflects this, independent of how many questions are filled in below. */
export const TOTAL_ASSESSMENT_QUESTIONS = 11;

/**
 * All 11 questions' copy has been shared. Only the option `icon`/`selectedIcon`
 * assets are still outstanding for a few of the later questions.
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'hair-goal',
    type: 'choice',
    title: 'What do you want your hair to do?',
    subtitle: 'This sets what your plan optimizes for first.',
    options: [
      {
        id: 'stop-the-fall',
        title: 'Stop the fall',
        description: 'Reduce daily shedding',
        icon: require('../../assets/images/stop-hairfall.png'),
        selectedIcon: require('../../assets/images/stop-hairfall-selected.png'),
      },
      {
        id: 'regrow-density',
        title: 'Regrow density',
        description: 'Filling thinning zones',
        icon: require('../../assets/images/regrow-density.png'),
        selectedIcon: require('../../assets/images/regrow-density-selected.png'),
      },
      {
        id: 'repair-quality',
        title: 'Repair quality',
        description: 'Frizz, dryness, breakage',
        icon: require('../../assets/images/repair-quality.png'),
        selectedIcon: require('../../assets/images/repair-quality-selected.png'),
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
    title: 'What does your hair look like naturally?',
    subtitle: 'Untreated, no straightening, coloring or perming.',
    options: [
      {
        id: 'straight-hair',
        title: 'Straight hair',
        icon: require('../../assets/images/straight-hair.png'),
        selectedIcon: require('../../assets/images/straight-hair-selected.png'),
      },
      {
        id: 'wavy-hair',
        title: 'Wavy hair',
        icon: require('../../assets/images/wavy-hair.png'),
        selectedIcon: require('../../assets/images/wavy-hair-selected.png'),
      },
      {
        id: 'curly-hair',
        title: 'Curly hair',
        icon: require('../../assets/images/curly-hair.png'),
        selectedIcon: require('../../assets/images/curly-hair-selected.png'),
      },
      {
        id: 'coily-hair',
        title: 'Coily hair',
        icon: require('../../assets/images/coily-hair.png'),
        selectedIcon: require('../../assets/images/coily-hair-selected.png'),
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
    variant: 'grid',
    title: 'Which parting looks most like yours?',
    subtitle:
      'Part your hair and check a mirror, more visible scalp means a later stage.',
    options: [
      {
        id: 'even-parting',
        title: 'Even parting',
        genderedIcon: {
          male: require('../../assets/images/even-parting-m.png'),
          female: require('../../assets/images/even-parting-f.png'),
        },
        genderedSelectedIcon: {
          male: require('../../assets/images/even-parting-selected-m.png'),
          female: require('../../assets/images/even-parting-selected-f.png'),
        },
      },
      {
        id: 'widening-parting',
        title: 'Widening parting',
        genderedIcon: {
          male: require('../../assets/images/widening-parting-m.png'),
          female: require('../../assets/images/widening-parting-f.png'),
        },
        genderedSelectedIcon: {
          male: require('../../assets/images/widening-parting-selected-m.png'),
          female: require('../../assets/images/widening-parting-selected-f.png'),
        },
      },
      {
        id: 'advanced-widening',
        title: 'Advanced widening',
        genderedIcon: {
          male: require('../../assets/images/advanced-widening-m.png'),
          female: require('../../assets/images/advanced-widening-f.png'),
        },
        genderedSelectedIcon: {
          male: require('../../assets/images/advanced-widening-selected-m.png'),
          female: require('../../assets/images/advanced-widening-selected-f.png'),
        },
      },
      {
        id: 'diffuse-thinning',
        title: 'Diffuse thinning',
        genderedIcon: {
          male: require('../../assets/images/diffuse-thinning-m.png'),
          female: require('../../assets/images/diffuse-thinning-f.png'),
        },
        genderedSelectedIcon: {
          male: require('../../assets/images/diffuse-thinning-selected-m.png'),
          female: require('../../assets/images/diffuse-thinning-selected-f.png'),
        },
      },
      {
        id: 'coin-size-patch',
        title: 'Coin size patch',
        genderedIcon: {
          male: require('../../assets/images/coin-size-patch-m.png'),
          female: require('../../assets/images/coin-size-patch-f.png'),
        },
        genderedSelectedIcon: {
          male: require('../../assets/images/coin-size-patch-selected-m.png'),
          female: require('../../assets/images/coin-size-patch-selected-f.png'),
        },
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
      {id: 'none-of-these', title: 'None of these', exclusive: true},
      {id: 'thyroid', title: 'Thyroid'},
      {id: 'anemia-low-haemoglobin', title: 'Anemia or low haemoglobin'},
      {id: 'severe-illness-or-surgery', title: 'Severe illness or surgery'},
      {id: 'pcos-hormonal-imbalance', title: 'PCOS or hormonal imbalance'},
      {id: 'pregnancy-post-partum', title: 'Pregnancy or post-partum'},
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
      {id: 'none-of-these', title: 'None of these', exclusive: true},
      {id: 'high-blood-pressure', title: 'High blood pressure'},
      {id: 'low-blood-pressure', title: 'Low blood pressure'},
      {id: 'liver-condition', title: 'Liver condition'},
      {id: 'cardiovascular-disorder', title: 'Cardiovascular disorder'},
      {id: 'on-prescription-medicine', title: 'On prescription medicine'},
    ],
  },
  {
    id: 'diet',
    type: 'choice',
    variant: 'checkbox',
    title: 'How would you describe your diet?',
    subtitle: 'Your diet plan and your capsule base both depend on this.',
    options: [
      {id: 'vegetarian', title: 'Vegetarian'},
      {id: 'vegan', title: 'Vegan'},
      {id: 'eggetarian', title: 'Eggetarian'},
      {id: 'non-vegetarian', title: 'Non-vegetarian'},
    ],
  },
];
