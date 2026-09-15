import React, { useEffect, useState } from 'react';
import {
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_SECTION_LENGTHS,
} from '../data/assessmentQuestions';
import { ReactVideoSource } from 'react-native-video';
import { IconGender } from '../data/userGender';
import AssessmentMilestoneScreen from './AssessmentMilestoneScreen';
import AssessmentQuestionScreen from './AssessmentQuestionScreen';

const MAGNIFYING_GLASS_VIDEO = require('../../assets/videos/magnifying-glass-hair-scalp.mp4');
const LIFESTYLE_VIDEO = require('../../assets/videos/lifestyle.mp4');
const DIET_VIDEO = require('../../assets/videos/diet.mp4');

type MilestoneConfig = {
  video?: ReactVideoSource;
  headline: string;
  subcopy: string;
  buttonLabel: string;
};

/**
 * One breather screen after each section except the last, in section order — e.g. the first
 * entry shows right after "Hair basics" finishes.
 */
const MILESTONES: MilestoneConfig[] = [
  {
    video: MAGNIFYING_GLASS_VIDEO,
    headline: "That's your baseline set",
    subcopy:
      "Next, we look at what's actually happening on your scalp right now, shedding pattern, parting, oil cycle. This is where your diagnosis starts taking real shape.",
    buttonLabel: "Let's check your scalp",
  },
  {
    video: LIFESTYLE_VIDEO,
    headline: 'Your scalp picture is complete',
    subcopy:
      "Now for the everyday factors, stress and sleep both change how long a follicle stays in its growth phase. A few quick questions and we'll have the full picture.",
    buttonLabel: "Let's talk lifestyle",
  },
  {
    video: DIET_VIDEO,
    headline: 'Almost at your plan',
    subcopy:
      'Last stretch, your health history and diet. This is what keeps every product in your kit safe and dosed correctly for you.',
    buttonLabel: "Let's finish up",
  },
];

/**
 * Running question-count total after each section (e.g. [3, 6, 8, 11] for section lengths
 * [3, 3, 2, 3]) — the last entry is the end of the whole assessment, not a milestone breakpoint.
 */
const SECTION_END_COUNTS = ASSESSMENT_SECTION_LENGTHS.reduce<number[]>(
  (totals, length) => [...totals, (totals[totals.length - 1] ?? 0) + length],
  [],
);

/** Maps "questions answered so far" to the milestone that should show next, keyed by that count. */
const MILESTONES_BY_BREAKPOINT = new Map(
  MILESTONES.map((milestone, index) => [SECTION_END_COUNTS[index], milestone]),
);

type AssessmentFlowScreenProps = {
  iconGender: IconGender;
  onComplete: () => void;
  /** Called when back is pressed on the very first question — there's nowhere within the flow to go. */
  onExit: () => void;
};

/** Owns the current question index/answers; renders one AssessmentQuestionScreen at a time. */
function AssessmentFlowScreen({
  iconGender,
  onComplete,
  onExit,
}: AssessmentFlowScreenProps): React.JSX.Element | null {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [, setAnswers] = useState<Record<string, string>>({});
  const [activeMilestone, setActiveMilestone] = useState<MilestoneConfig | null>(null);

  const question = ASSESSMENT_QUESTIONS[questionIndex];

  useEffect(() => {
    if (!question) {
      onComplete();
    }
  }, [question, onComplete]);

  function handleSelectOption(optionId: string) {
    setAnswers(previous => ({ ...previous, [question.id]: optionId }));
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    const milestone = MILESTONES_BY_BREAKPOINT.get(nextIndex);
    if (milestone) {
      setActiveMilestone(milestone);
    }
  }

  function handleBack() {
    if (questionIndex === 0) {
      onExit();
    } else {
      setQuestionIndex(previous => previous - 1);
    }
  }

  if (activeMilestone) {
    return (
      <AssessmentMilestoneScreen
        video={activeMilestone.video}
        headline={activeMilestone.headline}
        subcopy={activeMilestone.subcopy}
        buttonLabel={activeMilestone.buttonLabel}
        onContinue={() => setActiveMilestone(null)}
      />
    );
  }

  if (!question) {
    return null;
  }

  return (
    <AssessmentQuestionScreen
      key={question.id}
      question={question}
      questionNumber={questionIndex + 1}
      iconGender={iconGender}
      onSelectOption={handleSelectOption}
      onBack={handleBack}
    />
  );
}

export default AssessmentFlowScreen;
