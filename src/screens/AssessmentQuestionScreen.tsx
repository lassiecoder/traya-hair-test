import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AgePicker from '../components/AgePicker';
import AssessmentNote from '../components/AssessmentNote';
import Button from '../components/Button';
import CheckboxOptionCard, {
  CHECKBOX_SELECT_FEEDBACK_MS,
} from '../components/CheckboxOptionCard';
import OptionCard, {
  OPTION_SELECT_ANIMATION_MS,
} from '../components/OptionCard';
import ProgressBar from '../components/ProgressBar';
import ScreenContainer from '../components/ScreenContainer';
import { IconGender } from '../data/userGender';
import { colors, textStyles } from '../theme';
import { AssessmentOption, AssessmentQuestion } from '../types/assessment';
import {
  resolveOptionIcon,
  resolveOptionSelectedIcon,
} from '../utils/assessmentIcons';

const BACK_ICON = require('../../assets/images/back-btn.png');

const HEADER_ENTRANCE_MS = 360;
const BODY_ENTRANCE_MS = 360;
const BODY_ENTRANCE_DELAY_MS = 90;
const HEADER_ENTRANCE_OFFSET = 48;
const BODY_ENTRANCE_OFFSET = 40;

type AssessmentQuestionScreenProps = {
  question: AssessmentQuestion;
  questionNumber: number;
  totalQuestions: number;
  iconGender: IconGender;
  onSelectOption: (optionId: string) => void;
  onBack: () => void;
};

function AssessmentQuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  iconGender,
  onSelectOption,
  onBack,
}: AssessmentQuestionScreenProps): React.JSX.Element {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [age, setAge] = useState(
    question.type === 'age' ? question.defaultAge : 0,
  );
  const headerAnim = useRef(new Animated.Value(0)).current;
  const bodyAnim = useRef(new Animated.Value(0)).current;

  const isCheckboxVariant =
    question.type === 'choice' && question.variant === 'checkbox';
  const isGridVariant =
    question.type === 'choice' && question.variant === 'grid';
  const isMultiSelect =
    question.type === 'choice' && question.multiSelect === true;

  useEffect(() => {
    if (!selectedOptionId || isMultiSelect) {
      return;
    }
    const delay = isCheckboxVariant
      ? CHECKBOX_SELECT_FEEDBACK_MS
      : OPTION_SELECT_ANIMATION_MS;
    const timeout = setTimeout(() => onSelectOption(selectedOptionId), delay);
    return () => clearTimeout(timeout);
  }, [selectedOptionId, onSelectOption, isCheckboxVariant, isMultiSelect]);

  // Runs once per mount — the parent remounts this screen (via `key`) for each new question.
  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: HEADER_ENTRANCE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bodyAnim, {
        toValue: 1,
        duration: BODY_ENTRANCE_MS,
        delay: BODY_ENTRANCE_DELAY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleMultiSelectOption(
    option: AssessmentOption,
    allOptions: AssessmentOption[],
  ) {
    setSelectedOptionIds(previous => {
      if (option.exclusive) {
        return previous.includes(option.id) ? [] : [option.id];
      }
      const withoutExclusiveOptions = previous.filter(id => {
        const previousOption = allOptions.find(o => o.id === id);
        return !previousOption?.exclusive;
      });
      return withoutExclusiveOptions.includes(option.id)
        ? withoutExclusiveOptions.filter(id => id !== option.id)
        : [...withoutExclusiveOptions, option.id];
    });
  }

  const headerTranslateX = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [HEADER_ENTRANCE_OFFSET, 0],
  });
  const bodyTranslateY = bodyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [BODY_ENTRANCE_OFFSET, 0],
  });
  // No opacity fade: solid colors.primary elements (the age number, buttons, filled cards)
  // fading against the pale page background blend into a washed-out mid-tone for a frame or
  // two before snapping to full color, which reads as a flicker. A pure slide avoids it.
  const bodyAnimatedStyle = { transform: [{ translateY: bodyTranslateY }] };
  // Options list only: slides up together with an opacity fade, all cards moving as one block.
  const optionsAnimatedStyle = {
    opacity: bodyAnim,
    transform: [{ translateY: bodyTranslateY }],
  };
  const pushesFollowingContentToBottom =
    Boolean(question.note) || isMultiSelect;

  const progressHeader = (
    <View style={styles.progressRow}>
      <Pressable onPress={onBack} style={styles.backButton} hitSlop={8}>
        <Image
          source={BACK_ICON}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </Pressable>
      <View style={styles.progressBarWrap}>
        <ProgressBar current={questionNumber} total={totalQuestions} />
      </View>
    </View>
  );

  return (
    <ScreenContainer header={progressHeader}>
      <Text style={styles.progressLabel}>
        {questionNumber}/{totalQuestions}
      </Text>

      <Animated.View style={{ transform: [{ translateX: headerTranslateX }] }}>
        <Text style={styles.title}>{question.title}</Text>
        <Text style={styles.subtitle}>{question.subtitle}</Text>
      </Animated.View>

      {question.type === 'choice' ? (
        <Animated.View
          style={[
            pushesFollowingContentToBottom && styles.bodyFlex,
            isGridVariant && styles.grid,
            optionsAnimatedStyle,
          ]}
        >
          {question.options.map(option =>
            isCheckboxVariant ? (
              <CheckboxOptionCard
                key={option.id}
                title={option.title}
                description={option.description}
                selected={
                  isMultiSelect
                    ? selectedOptionIds.includes(option.id)
                    : selectedOptionId === option.id
                }
                disabled={
                  !isMultiSelect &&
                  selectedOptionId !== null &&
                  selectedOptionId !== option.id
                }
                onPress={() =>
                  isMultiSelect
                    ? toggleMultiSelectOption(option, question.options)
                    : setSelectedOptionId(option.id)
                }
              />
            ) : (
              <OptionCard
                key={option.id}
                title={option.title}
                description={option.description}
                icon={resolveOptionIcon(option, iconGender)}
                selectedIcon={resolveOptionSelectedIcon(option, iconGender)}
                selected={selectedOptionId === option.id}
                disabled={
                  selectedOptionId !== null && selectedOptionId !== option.id
                }
                onPress={() => setSelectedOptionId(option.id)}
                layout={isGridVariant ? 'grid' : 'row'}
                style={isGridVariant && styles.gridCard}
              />
            ),
          )}
        </Animated.View>
      ) : (
        <Animated.View style={[styles.ageBody, bodyAnimatedStyle]}>
          <View style={styles.ageRulerWrapper}>
            <AgePicker
              minAge={question.minAge}
              maxAge={question.maxAge}
              value={age}
              onChange={setAge}
            />
          </View>
          <Button
            label="Continue"
            onPress={() => onSelectOption(String(age))}
          />
        </Animated.View>
      )}

      {question.note ? (
        <Animated.View style={bodyAnimatedStyle}>
          <AssessmentNote text={question.note} />
        </Animated.View>
      ) : null}

      {isMultiSelect ? (
        <Animated.View style={bodyAnimatedStyle}>
          <Button
            label="Continue"
            disabled={selectedOptionIds.length === 0}
            onPress={() => onSelectOption(selectedOptionIds.join(','))}
            style={question.note ? styles.continueWithNote : undefined}
          />
        </Animated.View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  progressBarWrap: {
    flex: 1,
  },
  progressLabel: {
    ...textStyles.caption,
    color: colors.textMuted,
    marginTop: 12,
    marginBottom: 24,
  },
  title: {
    ...textStyles.title,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textMuted,
    marginBottom: 28,
  },
  bodyFlex: {
    flex: 1,
  },
  ageBody: {
    flex: 1,
  },
  ageRulerWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
  },
  continueWithNote: {
    marginTop: 16,
  },
});

export default AssessmentQuestionScreen;
