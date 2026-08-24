import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, textStyles} from '../theme';

/** Time the checked state stays visible before the flow advances. */
export const CHECKBOX_SELECT_FEEDBACK_MS = 300;

const CHECKED_ICON = require('../../assets/images/checked.png');

type CheckboxOptionCardProps = {
  title: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

/** Static (non-filling) card with a checkbox indicator — used for questions like "How much hair are you losing?" */
function CheckboxOptionCard({
  title,
  description,
  selected,
  disabled,
  onPress,
}: CheckboxOptionCardProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [styles.card, pressed && !disabled && styles.cardPressed]}>
      <View style={styles.checkboxWrap}>
        {selected ? (
          <Image source={CHECKED_ICON} style={styles.checkboxImage} resizeMode="contain" />
        ) : (
          <View style={styles.checkboxEmpty} />
        )}
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.title, !description && styles.titleOnly]}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardPressed: {
    opacity: 0.75,
  },
  checkboxWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxEmpty: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
  },
  checkboxImage: {
    width: 22,
    height: 22,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    ...textStyles.label,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  titleOnly: {
    marginBottom: 0,
  },
  description: {
    ...textStyles.caption,
    color: colors.textMuted,
  },
});

export default CheckboxOptionCard;
