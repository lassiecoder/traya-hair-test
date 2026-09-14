import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Video, { ReactVideoSource } from 'react-native-video';
import Button from '../components/Button';
import { colors, textStyles } from '../theme';

const TEXT_ENTRANCE_MS = 420;
const TEXT_ENTRANCE_OFFSET = 32;

/**
 * How much of the screen's height the top-to-bottom background gradient takes to fully settle
 * into `colors.background` — kept late so the white headline/subcopy (which sit directly on the
 * gradient, no card behind them) never cross into the light zone where white text disappears.
 */
const GRADIENT_SETTLE_LOCATION = 1;

type AssessmentMilestoneScreenProps = {
  /** Video shown at the top — takes priority over `image` if both are given. */
  video?: ReactVideoSource;
  /** Static image shown at the top, used when there's no video for this checkpoint. */
  image?: ImageSourcePropType;
  headline: string;
  subcopy: string;
  buttonLabel: string;
  onContinue: () => void;
};

/**
 * Checkpoint shown between assessment sections — a breather confirming progress before the next
 * round of questions. Deliberately breaks from the rest of the app's flat-background/padded-card
 * look: a video or photo on a dark-to-light gradient, with the copy sitting directly on the
 * gradient below it (no card).
 */
function AssessmentMilestoneScreen({
  video,
  image,
  headline,
  subcopy,
  buttonLabel,
  onContinue,
}: AssessmentMilestoneScreenProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const textEntranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(textEntranceAnim, {
      toValue: 1,
      duration: TEXT_ENTRANCE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textTranslateY = textEntranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [TEXT_ENTRANCE_OFFSET, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        pointerEvents="none"
        colors={[colors.primary, colors.background]}
        locations={[0, GRADIENT_SETTLE_LOCATION]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.videoWrap}>
          {video ? (
            <Video
              source={video}
              style={styles.video}
              resizeMode="cover"
              repeat
              muted
              paused={false}
              controls={false}
              playInBackground={false}
              playWhenInactive={false}
              ignoreSilentSwitch="ignore"
            />
          ) : image ? (
            <Image source={image} style={styles.video} resizeMode="cover" />
          ) : null}
        </View>

        <Animated.View
          style={[
            styles.textBlock,
            { transform: [{ translateY: textTranslateY }] },
          ]}
        >
          <Text style={styles.headline}>{headline}</Text>
          <Text style={styles.subcopy}>{subcopy}</Text>
        </Animated.View>
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <Button label={buttonLabel} onPress={onContinue} />
      </View>
    </View>
  );
}

const VIDEO_ASPECT_RATIO = 1042 / 610;
/** Side inset that keeps the video off the screen edges, matching the rest of the app's padding. */
const VIDEO_HORIZONTAL_MARGIN = 24;
// Computed from the screen's own pixel width rather than left to `aspectRatio` — Yoga's
// aspectRatio resolution has rounded inconsistently enough across platforms in the past that a
// precisely-sized element is worth pinning to an exact width instead of trusting it.
const SCREEN_WIDTH = Dimensions.get('window').width;
const VIDEO_WIDTH = SCREEN_WIDTH - VIDEO_HORIZONTAL_MARGIN * 2;
const VIDEO_HEIGHT = VIDEO_WIDTH / VIDEO_ASPECT_RATIO;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  videoWrap: {
    alignSelf: 'center',
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    marginBottom: 28,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    marginTop: 200,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    paddingHorizontal: 24,
  },
  headline: {
    ...textStyles.title,
    color: colors.onPrimary,
    marginBottom: 12,
  },
  subcopy: {
    ...textStyles.body,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});

export default AssessmentMilestoneScreen;
