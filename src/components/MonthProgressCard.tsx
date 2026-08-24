import React from 'react';
import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import {colors, textStyles} from '../theme';

type MonthProgressCardProps = {
  icon: ImageSourcePropType;
  label: string;
  description: string;
};

/** One card in the horizontally-scrolling "what N months looks like" row. */
function MonthProgressCard({icon, label, description}: MonthProgressCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
  },
  icon: {
    width: '100%',
    height: 110,
    marginBottom: 14,
  },
  label: {
    ...textStyles.label,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  description: {
    ...textStyles.caption,
    color: colors.textMuted,
  },
});

export default MonthProgressCard;
