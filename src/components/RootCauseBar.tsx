import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
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

  useEffect(() => {
    const listenerId = progress.addListener(({value}) => setDisplayedPercent(Math.round(value)));

    Animated.timing(progress, {
      toValue: percent,
      duration: FILL_ANIMATION_MS,
      useNativeDriver: false,
    }).start();

    return () => progress.removeListener(listenerId);
  }, [percent, progress]);

  const width = progress.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']});

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.percent}>{displayedPercent}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, {width}]} />
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    ...textStyles.label,
    color: colors.textPrimary,
  },
  percent: {
    ...textStyles.label,
    color: colors.textPrimary,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.divider,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  description: {
    ...textStyles.caption,
    color: colors.textMuted,
    marginTop: 8,
  },
});

export default RootCauseBar;
