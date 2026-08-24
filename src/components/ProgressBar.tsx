import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../theme';

type ProgressBarProps = {
  current: number;
  total: number;
};

function ProgressBar({current, total}: ProgressBarProps): React.JSX.Element {
  const progress = total > 0 ? Math.min(current / total, 1) : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, {width: `${progress * 100}%`}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});

export default ProgressBar;
