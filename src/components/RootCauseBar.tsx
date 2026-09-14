import React, {useEffect, useRef, useState} from 'react';
import {Animated, LayoutChangeEvent, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, textStyles} from '../theme';

/** How long the bar (and the counting percentage) takes to reach its target on mount. */
const FILL_ANIMATION_MS = 900;

type RootCauseBarProps = {
  title: string;
  percent: number;
  description: string;
};

/** A labeled progress bar that fills from 0 to `percent` once, on mount, with the percentage counting up in step. */
function RootCauseBar({title, percent, description}: RootCauseBarProps): React.JSX.Element {
  const progress = useRef(new Animated.Value(0)).current;
  const [displayedPercent, setDisplayedPercent] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const listenerId = progress.addListener(({value}) => setDisplayedPercent(Math.round(value)));

    Animated.timing(progress, {
      toValue: percent,
      duration: FILL_ANIMATION_MS,
      useNativeDriver: false,
    }).start();

    return () => progress.removeListener(listenerId);
  }, [percent, progress]);

  function handleTrackLayout(event: LayoutChangeEvent) {
    setTrackWidth(event.nativeEvent.layout.width);
  }

  const fillWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [0, trackWidth],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.row}>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.track} onLayout={handleTrackLayout}>
          {trackWidth > 0 ? (
            // The gradient itself is a fixed size (never animated — a LinearGradient whose own
            // width changes every frame doesn't reliably repaint its native gradient layer).
            // What animates is this plain clipping mask's width, revealing more of it.
            <Animated.View style={[styles.fillMask, {width: fillWidth}]}>
              <LinearGradient
                colors={[colors.primaryMuted, colors.primary]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[styles.fillGradient, {width: trackWidth}]}
              />
            </Animated.View>
          ) : null}
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.percentBadge}>
        <Text style={styles.percentText}>{displayedPercent}%</Text>
      </View>
    </View>
  );
}

const PERCENT_BADGE_SIZE = 48;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    marginRight: 14,
  },
  title: {
    ...textStyles.label,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.divider,
    overflow: 'hidden',
  },
  fillMask: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  fillGradient: {
    height: '100%',
  },
  description: {
    ...textStyles.caption,
    color: colors.textMuted,
    marginTop: 8,
  },
  percentBadge: {
    width: PERCENT_BADGE_SIZE,
    height: PERCENT_BADGE_SIZE,
    borderRadius: PERCENT_BADGE_SIZE / 2,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    ...textStyles.captionEmphasis,
    color: colors.textPrimary,
  },
});

export default RootCauseBar;
