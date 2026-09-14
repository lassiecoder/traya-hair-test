import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../theme';

const SEGMENT_GAP = 6;
const TRACK_HEIGHT = 4;
const DOT_SIZE = 10;

type ProgressBarProps = {
  /** 1-based overall position across every question in every section combined. */
  current: number;
  /** Length of each section, in question order — e.g. [3, 3, 3, 2]. */
  sections: number[];
};

/**
 * Segmented progress track — one bar per section (gapped). A finished section is a flat solid
 * fill; the section currently in progress gets a gradient fill with a bright dot at its leading
 * edge instead, so the eye finds "where you are" at a glance.
 */
function ProgressBar({current, sections}: ProgressBarProps): React.JSX.Element {
  let answeredBefore = 0;

  return (
    <View style={styles.row}>
      {sections.map((sectionLength, index) => {
        const sectionStart = answeredBefore;
        answeredBefore += sectionLength;
        const progressWithinSection = Math.min(
          Math.max(current - sectionStart, 0),
          sectionLength,
        );
        const progress = sectionLength > 0 ? progressWithinSection / sectionLength : 0;
        const isInProgress = progress > 0 && progress < 1;

        return (
          <View
            key={index}
            style={[styles.track, index < sections.length - 1 && styles.trackSpacing]}>
            {progress > 0 ? (
              isInProgress ? (
                <View style={[styles.fillWrap, {width: `${progress * 100}%`}]}>
                  <LinearGradient
                    colors={[colors.primary, colors.progressActiveEnd]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.fill}
                  />
                  <View style={styles.leadDot} />
                </View>
              ) : (
                <View style={[styles.fill, styles.fillComplete, {width: `${progress * 100}%`}]} />
              )
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  track: {
    flex: 1,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: colors.divider,
  },
  trackSpacing: {
    marginRight: SEGMENT_GAP,
  },
  fillWrap: {
    height: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: TRACK_HEIGHT / 2,
  },
  fillComplete: {
    backgroundColor: colors.primary,
  },
  leadDot: {
    position: 'absolute',
    top: -(DOT_SIZE - TRACK_HEIGHT) / 2,
    right: -DOT_SIZE / 2,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.progressActiveEnd,
  },
});

export default ProgressBar;
