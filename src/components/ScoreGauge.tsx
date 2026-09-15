import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, textStyles} from '../theme';

type Zone = {
  label: string;
  /** Inclusive upper bound of this zone, on a 0-100 scale. */
  upperBound: number;
  tint: string;
};

const ZONES: Zone[] = [
  {label: 'Early', upperBound: 35, tint: colors.primarySoft},
  {label: 'Moderate', upperBound: 70, tint: colors.primaryMuted},
  {label: 'Advanced', upperBound: 100, tint: colors.primary},
];

type ScoreGaugeProps = {
  /** 0-100 — the score already being animated/displayed above this gauge. */
  score: number;
};

/** Horizontal tonal severity meter — three zones shaded with increasingly strong tints of the same brand color, plus a marker at the current score. */
function ScoreGauge({score}: ScoreGaugeProps): React.JSX.Element {
  const clampedScore = Math.min(Math.max(score, 0), 100);
  let lowerBound = 0;
  const activeZone = ZONES.find(zone => clampedScore <= zone.upperBound) ?? ZONES[ZONES.length - 1];

  return (
    <View>
      <View style={styles.track}>
        {ZONES.map(zone => {
          const width = zone.upperBound - lowerBound;
          lowerBound = zone.upperBound;
          return (
            <View
              key={zone.label}
              style={[styles.zone, {flex: width, backgroundColor: zone.tint}]}
            />
          );
        })}
        <View style={[styles.marker, {left: `${clampedScore}%`}]} />
      </View>
      <View style={styles.labelRow}>
        {ZONES.map(zone => (
          <Text
            key={zone.label}
            style={[styles.zoneLabel, zone.label === activeZone.label && styles.zoneLabelActive]}>
            {zone.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const MARKER_SIZE = 14;

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  zone: {
    height: '100%',
  },
  marker: {
    position: 'absolute',
    top: -2,
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    marginLeft: -MARKER_SIZE / 2,
    backgroundColor: colors.onPrimary,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  zoneLabel: {
    ...textStyles.caption,
    color: colors.textMuted,
  },
  zoneLabelActive: {
    color: colors.textPrimary,
    fontFamily: textStyles.captionEmphasis.fontFamily,
  },
});

export default ScoreGauge;
