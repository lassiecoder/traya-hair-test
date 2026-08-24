import React, { useEffect, useState } from 'react';
import {
  ASSESSMENT_QUESTIONS,
  TOTAL_ASSESSMENT_QUESTIONS,
} from '../data/assessmentQuestions';
import { IconGender } from '../data/userGender';
import AssessmentQuestionScreen from './AssessmentQuestionScreen';

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

  const question = ASSESSMENT_QUESTIONS[questionIndex];

  useEffect(() => {
    if (!question) {
      onComplete();
    }
  }, [question, onComplete]);

  function handleSelectOption(optionId: string) {
    setAnswers(previous => ({ ...previous, [question.id]: optionId }));
    setQuestionIndex(previous => previous + 1);
  }

  function handleBack() {
    if (questionIndex === 0) {
      onExit();
    } else {
      setQuestionIndex(previous => previous - 1);
    }
  }

  if (!question) {
    return null;
  }

  return (
    <AssessmentQuestionScreen
      key={question.id}
      question={question}
      questionNumber={questionIndex + 1}
      totalQuestions={TOTAL_ASSESSMENT_QUESTIONS}
      iconGender={iconGender}
      onSelectOption={handleSelectOption}
      onBack={handleBack}
    />
  );
}

export default AssessmentFlowScreen;
