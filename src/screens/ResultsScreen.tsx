import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Image, LayoutChangeEvent, Pressable, StyleSheet, Text, View} from 'react-native';
import Button from '../components/Button';
import RootCauseBar from '../components/RootCauseBar';
import ScreenContainer from '../components/ScreenContainer';
import {colors, textStyles} from '../theme';

const BACK_ICON = require('../../assets/images/back-btn.png');

/** Matches RootCauseBar's percent-fill count-up duration, so the score and the root-cause bars read as one motion. */
const SCORE_COUNT_MS = 900;
const TEXT_ENTRANCE_MS = 360;
const TEXT_ENTRANCE_OFFSET = 24;

/**
 * TODO: replace with the real Hair Health Index computed from the 11 assessment
 * answers once that scoring model exists. Hardcoded to match the reference design.
 */
const RESULT = {
  score: 66,
  maxScore: 100,
  title: 'Moderate thinning, active shedding',
  description:
    'Your index compares follicle stage, shedding rate and the body signals you reported against 14,000 assessments in your age band.',
};

const ROOT_CAUSES = [
  {
    id: 'nutritional-gap',
    title: 'Nutritional gap',
    percent: 60,
    description: 'Protein, iron and biotin availability from your diet',
  },
  {
    id: 'scalp-environment',
    title: 'Scalp environment',
    percent: 48,
    description: 'Sebum load and barrier condition at the root',
  },
  {
    id: 'hormonal-imbalance',
    title: 'Hormonal imbalance',
    percent: 30,
    description: 'DHT sensitivity and thyroid markers from your history',
  },
  {
    id: 'stress-sleep-cycle',
    title: 'Stress & sleep cycle',
    percent: 28,
    description: 'Cortisol shortening the growth phase of the follicle',
  },
];

type ResultsScreenProps = {
  onSeeFullReport: () => void;
  onBack: () => void;
};

function ResultsScreen({onSeeFullReport, onBack}: ResultsScreenProps): React.JSX.Element {
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const [displayedScore, setDisplayedScore] = useState(0);
  const textEntranceAnim = useRef(new Animated.Value(0)).current;
  // Measured from an offscreen ghost rendering the final score, so the visible block can be
  // locked to that exact width — no digit-count change during the count-up can ever reflow it.
  const [scoreBlockWidth, setScoreBlockWidth] = useState<number | null>(null);

  function handleGhostLayout(event: LayoutChangeEvent) {
    setScoreBlockWidth(event.nativeEvent.layout.width);
  }

  useEffect(() => {
    const listenerId = scoreAnim.addListener(({value}) => setDisplayedScore(Math.round(value)));

    Animated.parallel([
      Animated.timing(scoreAnim, {
        toValue: RESULT.score,
        duration: SCORE_COUNT_MS,
        useNativeDriver: false,
      }),
      Animated.timing(textEntranceAnim, {
        toValue: 1,
        duration: TEXT_ENTRANCE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    return () => scoreAnim.removeListener(listenerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textTranslateY = textEntranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-TEXT_ENTRANCE_OFFSET, 0],
  });
  // No opacity fade: colors.primary text fading against the pale background blends into a
  // washed-out mid-tone for a frame before snapping to full color, which reads as a flicker.
  const textEntranceStyle = {transform: [{translateY: textTranslateY}]};

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backButton} hitSlop={8}>
          <Image source={BACK_ICON} style={styles.backIcon} resizeMode="contain" />
        </Pressable>
        <Animated.Text style={[styles.headerEyebrow, textEntranceStyle]}>
          YOUR RESULT · HAIR HEALTH INDEX
        </Animated.Text>
      </View>

      <View style={styles.scoreRow}>
        <View style={[styles.scoreBlock, scoreBlockWidth != null && {width: scoreBlockWidth}]}>
          <Text style={styles.scoreNumber}>{displayedScore}</Text>
          <Text style={styles.scoreMax}>/{RESULT.maxScore}</Text>
        </View>
        <Animated.Text style={[styles.resultTitle, textEntranceStyle]}>{RESULT.title}</Animated.Text>
      </View>

      {/* Invisible — exists only so handleGhostLayout can measure the final score's true rendered width. */}
      <View style={[styles.scoreBlock, styles.scoreGhost]} onLayout={handleGhostLayout} pointerEvents="none">
        <Text style={styles.scoreNumber}>{RESULT.score}</Text>
        <Text style={styles.scoreMax}>/{RESULT.maxScore}</Text>
      </View>

      <Animated.Text style={[styles.description, textEntranceStyle]}>{RESULT.description}</Animated.Text>

      <View style={styles.divider} />

      <Text style={styles.eyebrow}>ROOT CAUSES DETECTED</Text>

      <View style={styles.card}>
        {ROOT_CAUSES.map((cause, index) => (
          <View
            key={cause.id}
            style={[styles.causeRow, index < ROOT_CAUSES.length - 1 && styles.causeRowDivider]}>
            <RootCauseBar title={cause.title} percent={cause.percent} description={cause.description} />
          </View>
        ))}
      </View>

      <Button label="See full report" onPress={onSeeFullReport} style={styles.cta} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    width: 22,
    height: 22,
  },
  headerEyebrow: {
    ...textStyles.captionEmphasis,
    color: colors.textPrimary,
  },
  eyebrow: {
    ...textStyles.captionEmphasis,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  scoreBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 16,
  },
  scoreGhost: {
    position: 'absolute',
    opacity: 0,
  },
  scoreNumber: {
    fontSize: 56,
    lineHeight: 58,
    fontFamily: textStyles.title.fontFamily,
    color: colors.textPrimary,
  },
  scoreMax: {
    ...textStyles.body,
    color: colors.textMuted,
    marginLeft: 2,
    marginBottom: 6,
  },
  resultTitle: {
    flex: 1,
    fontSize: 22,
    lineHeight: 27,
    fontFamily: textStyles.title.fontFamily,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    ...textStyles.body,
    color: colors.textMuted,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 24,
  },
  causeRow: {
    padding: 20,
  },
  causeRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  cta: {
    marginBottom: 8,
  },
});

export default ResultsScreen;
