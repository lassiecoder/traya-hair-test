import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, fontFamily, textStyles} from '../theme';

const PLAN_ICON = require('../../assets/images/plan-customisation.gif');

const STEPS = [
  'Analysing your response',
  'Scoring follicle stage against the hair scale',
  'Checking every ingredient for safety',
  'Sequencing a 5-month protocol',
  'Assigning your hair coach',
];

/** Time each step spends "active" (highlighted, unchecked) before it's marked done and the next one starts. */
const STEP_DURATION_MS = 900;
/** Pause after the last step completes, before handing off. */
const FINISH_HOLD_MS = 600;

const HEADER_ENTRANCE_MS = 360;
const ICON_ENTRANCE_MS = 420;
const CARD_ENTRANCE_MS = 420;
const ICON_ENTRANCE_DELAY_MS = 120;
const CARD_ENTRANCE_DELAY_MS = 220;
const HEADER_ENTRANCE_OFFSET = 24;
const HEADER_PADDING_TOP = 16;
const ICON_ENTRANCE_OFFSET = 56;
const CARD_ENTRANCE_OFFSET = 40;

type PlanBuildingScreenProps = {
  onComplete: () => void;
};

/** Fake "processing" screen shown right after the last assessment question — steps tick off one at a time. */
function PlanBuildingScreen({onComplete}: PlanBuildingScreenProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [completedCount, setCompletedCount] = useState(0);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (completedCount >= STEPS.length) {
      const timeout = setTimeout(onComplete, FINISH_HOLD_MS);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setCompletedCount(previous => previous + 1), STEP_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [completedCount, onComplete]);

  // Runs once on mount — entrance animation, independent of the step-ticking state above.
  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: HEADER_ENTRANCE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: ICON_ENTRANCE_MS,
        delay: ICON_ENTRANCE_DELAY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: CARD_ENTRANCE_MS,
        delay: CARD_ENTRANCE_DELAY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerTranslateY = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-HEADER_ENTRANCE_OFFSET, 0],
  });
  const iconTranslateX = iconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [ICON_ENTRANCE_OFFSET, 0],
  });
  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CARD_ENTRANCE_OFFSET, 0],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + HEADER_PADDING_TOP}]}>
        <Animated.Text style={[styles.headerText, {transform: [{translateY: headerTranslateY}]}]}>
          BUILDING YOUR PLAN
        </Animated.Text>
      </View>

      <Animated.View style={[styles.iconWrapper, {transform: [{translateX: iconTranslateX}]}]}>
        <Image source={PLAN_ICON} style={styles.icon} resizeMode="contain" />
      </Animated.View>

      <Animated.View style={[styles.card, {transform: [{translateY: cardTranslateY}]}]}>
        {STEPS.map((step, index) => {
          const isCompleted = index < completedCount;
          const isActive = index === completedCount;
          return (
            <View key={step} style={[styles.row, index < STEPS.length - 1 && styles.rowDivider]}>
              <View style={[styles.checkCircle, isCompleted && styles.checkCircleFilled]}>
                {isCompleted ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
              <Text
                style={[
                  styles.stepText,
                  isCompleted || isActive ? styles.stepTextActive : styles.stepTextPending,
                ]}>
                {step}
              </Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
  },
  headerText: {
    fontFamily: fontFamily.extraBold,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.textPrimary,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  icon: {
    width: 160,
    height: 160,
  },
  card: {
    marginHorizontal: 24,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkCircleFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkMark: {
    color: colors.onPrimary,
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
  stepText: {
    ...textStyles.body,
    flex: 1,
  },
  stepTextActive: {
    color: colors.textPrimary,
  },
  stepTextPending: {
    color: colors.textMuted,
  },
});

export default PlanBuildingScreen;
