import { ImageSourcePropType } from 'react-native';
import { IconGender } from './userGender';

export interface MonthProgress {
  id: string;
  label: string;
  description: string;
  genderedIcon: Record<IconGender, ImageSourcePropType>;
}

export interface ProductDirection {
  period: string;
  instruction: string;
}

export interface ProductFaq {
  id: string;
  question: string;
  answer: string;
}

export interface ReportProduct {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  icon: ImageSourcePropType;
  /** Shown on the product detail screen: main shot first, then supporting graphics. */
  gallery: ImageSourcePropType[];
  longDescription: string;
  ingredients: string;
  howToUse: string;
  directions: ProductDirection[];
  badges: string[];
  faqs: ProductFaq[];
}

/**
 * TODO: replace with real per-product photography once it's shot — every
 * product reuses this gallery (lifted from the reference design) for now.
 */
const PRODUCT_GALLERY: ImageSourcePropType[] = [
  require('../../assets/images/product-1.png'),
  require('../../assets/images/product-2.png'),
  require('../../assets/images/product-3.png'),
  require('../../assets/images/product-4.png'),
];

/**
 * TODO: replace with real diagnosis/plan content computed from the assessment
 * answers and an actual pricing/catalog source. Hardcoded to match the
 * reference design for now.
 */
export const DIAGNOSIS = {
  headline:
    'Moderate thinning, active shedding, driven mostly by nutritional gap.',
  description:
    'A condition where the roots around the middle parting enter the resting phase early, leading to excessive shedding. Corrected at the cause, not the symptom.',
};

export const DENSITY_MAP_MONTH_0_ICON: Record<IconGender, ImageSourcePropType> = {
  male: require('../../assets/images/month-0-m.png'),
  female: require('../../assets/images/month-0-f.png'),
};

export const MONTH_PROGRESS: MonthProgress[] = [
  {
    id: 'month-1',
    label: 'MONTH 1',
    description: 'Shedding settles',
    genderedIcon: {
      male: require('../../assets/images/month-1-m.png'),
      female: require('../../assets/images/month-1-f.png'),
    },
  },
  {
    id: 'month-3',
    label: 'MONTH 3',
    description: 'Baby hair at the parting',
    genderedIcon: {
      male: require('../../assets/images/month-3-m.png'),
      female: require('../../assets/images/month-3-f.png'),
    },
  },
  {
    id: 'month-5',
    label: 'MONTH 5',
    description: 'Visible density',
    genderedIcon: {
      male: require('../../assets/images/month-5-m.png'),
      female: require('../../assets/images/month-5-f.png'),
    },
  },
];

export const CLINICAL_EVIDENCE = {
  headline: '93% of users saw hair fall reduce by 3 months',
  studyLine: 'Observational study, 1,285 users on a full-course plan, 2024.',
  caveatLine: 'Results depends on adherence',
};

export const REPORT_PRODUCTS: ReportProduct[] = [
  {
    id: 'nourish-tablets',
    category: 'CORE',
    title: 'Nourish Tablets',
    description: 'Balances hormones, restores the growth phase',
    price: 630,
    originalPrice: 700,
    icon: require('../../assets/images/tablets.png'),
    gallery: PRODUCT_GALLERY,
    longDescription:
      'Formulated for exactly the pattern your assessment found. It works upstream of the follicle, supporting hormonal balance, reducing androgen load and improving the nutrient supply that a strand needs to stay in its growth phase longer.',
    ingredients:
      'Biotin, Saw Palmetto, Zinc, Iron and Vitamin D3, dosed to your assessment — the tablet itself doesn’t change, only the length of the course.',
    howToUse:
      'Take with a meal, morning and evening, at roughly the same time each day. Consistency matters more than the exact hour — missed doses don’t need to be doubled up.',
    directions: [
      { period: 'Morning', instruction: '2 tablets after breakfast' },
      { period: 'Evening', instruction: '2 tablets after dinner' },
    ],
    badges: ['HEAVY METALS FREE', 'AYUSH CERTIFIED', '100% VEGETARIAN'],
    faqs: [
      {
        id: 'other-supplements',
        question: 'Is it safe to take with other supplements?',
        answer:
          'Yes, unless you flagged a prescription medication in the assessment — in that case your hair coach reviews the combination before dispatch.',
      },
      {
        id: 'course-length',
        question: 'How long do I follow the course?',
        answer:
          "Five months, matched to one full hair growth cycle. Your coach reviews progress at each shipment and adjusts the next month's dose if needed.",
      },
      {
        id: 'stop-early',
        question: 'What happens if I stop early?',
        answer:
          "Shedding typically returns within a few weeks, since the tablets support the growth phase rather than replace it. There's no withdrawal risk — you can restart anytime.",
      },
    ],
  },
  {
    id: 'hair-ras',
    category: 'AYURVEDA',
    title: 'Hair Ras',
    description: 'Ayurvedic base that treats the internal cause',
    price: 458,
    originalPrice: 520,
    icon: require('../../assets/images/hair-ras.png'),
    gallery: PRODUCT_GALLERY,
    longDescription:
      'An ayurvedic base built from root extracts your assessment flagged for your body type, taken alongside the tablets to support digestion and nutrient absorption at the source.',
    ingredients:
      'Bhringraj, Amla and Neem in a classical decoction ratio, prepared without synthetic preservatives.',
    howToUse:
      'One capful in a small glass of warm water, once daily before breakfast. Shake well before use.',
    directions: [
      {
        period: 'Morning',
        instruction: '1 capful in warm water before breakfast',
      },
    ],
    badges: ['HEAVY METALS FREE', 'AYUSH CERTIFIED', '100% VEGETARIAN'],
    faqs: [
      {
        id: 'taste',
        question: 'Does it have a strong taste?',
        answer:
          'It has a mild bitterness typical of ayurvedic formulations — most users mix it into warm water rather than taking it neat.',
      },
      {
        id: 'course-length',
        question: 'How long do I follow the course?',
        answer:
          "Five months, alongside the rest of your kit — it's paced to the same growth cycle.",
      },
      {
        id: 'stop-early',
        question: 'What happens if I stop early?',
        answer:
          'No withdrawal effects, but nutrient-absorption support from the tablets drops off, so results from the rest of the kit may slow.',
      },
    ],
  },
  {
    id: 'scalp-oil',
    category: 'SCALP',
    title: 'Scalp Oil 100ml',
    description: 'Stimulates root circulation twice a week',
    price: 890,
    originalPrice: 1220,
    icon: require('../../assets/images/scalp-oil.png'),
    gallery: PRODUCT_GALLERY,
    longDescription:
      'A pre-wash oil that drives circulation at the root, formulated to sit on the scalp without clogging follicles the way heavier oils can.',
    ingredients:
      'Redensyl, Rosemary and Bhringraj oil in a lightweight, non-comedogenic base.',
    howToUse:
      'Section the hair and apply directly to the scalp, twice a week. Massage for two minutes, leave for at least an hour before washing out.',
    directions: [
      {
        period: 'Twice a week',
        instruction: 'Massage into the scalp, leave for 1+ hour before washing',
      },
    ],
    badges: ['HEAVY METALS FREE', 'NON-COMEDOGENIC', '100% VEGETARIAN'],
    faqs: [
      {
        id: 'leave-overnight',
        question: 'Can I leave it in overnight?',
        answer:
          "Yes — it won't clog follicles, though most users find twice-weekly daytime use easier to stick to.",
      },
      {
        id: 'course-length',
        question: 'How long do I follow the course?',
        answer:
          'Five months, twice weekly — consistency matters more than frequency here.',
      },
      {
        id: 'stop-early',
        question: 'What happens if I stop early?',
        answer:
          'Circulation support at the root drops off within a couple of weeks; no other side effects.',
      },
    ],
  },
  {
    id: 'active-growth-serum',
    category: 'TOPICAL',
    title: 'Active Growth Serum',
    description: 'Applied daily to thinning zones',
    price: 567,
    originalPrice: 600,
    icon: require('../../assets/images/serum.png'),
    gallery: PRODUCT_GALLERY,
    longDescription:
      'Applied daily to thinning zones, this serum works on the root cause of hair fall — controlling shedding, blocking DHT locally and improving follicle health without a prescription.',
    ingredients: '3% Redensyl, 5% Capixyl & 3% Procapil.',
    howToUse:
      'Apply nightly using the dropper, right along the parting. Do not wash off immediately.',
    directions: [
      {
        period: 'Nightly',
        instruction: 'Apply with the dropper, do not wash off immediately',
      },
    ],
    badges: ['DERMATOLOGY POWERED', 'HEAVY METALS FREE', '100% VEGETARIAN'],
    faqs: [
      {
        id: 'tingling',
        question: 'Is a slight tingling normal?',
        answer:
          "Yes, for the first couple of weeks as your scalp adjusts. If it doesn't ease, tell your hair coach.",
      },
      {
        id: 'course-length',
        question: 'How long do I follow the course?',
        answer:
          'Five months, applied nightly — most users see the shedding numbers move first, density later.',
      },
      {
        id: 'stop-early',
        question: 'What happens if I stop early?',
        answer:
          'DHT-blocking support at the root stops immediately; no rebound effect, but progress plateaus where it is.',
      },
    ],
  },
];

export const ALSO_INCLUDED = [
  {
    id: 'hair-coach',
    title: 'Hair coach',
    description: 'A named expert on call through the course',
  },
  {
    id: 'diet-plan',
    title: 'Diet plan',
    description: 'Built around your diet answer, not generic',
  },
];

export const PLAN_TOTAL_PRICE = 2545;
