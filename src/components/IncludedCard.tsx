import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {colors, textStyles} from '../theme';

type IncludedCardProps = {
  title: string;
  description: string;
  style?: StyleProp<ViewStyle>;
};

/** Static info card, e.g. "Hair coach" / "Diet plan" under "Also included, no extra cost". */
function IncludedCard({title, description, style}: IncludedCardProps): React.JSX.Element {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    padding: 16,
  },
  title: {
    ...textStyles.label,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    ...textStyles.caption,
    color: colors.textMuted,
  },
});

export default IncludedCard;
