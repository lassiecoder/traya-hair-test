import React from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import {colors, shadows} from '../theme';

const BACK_ICON = require('../../assets/images/back-btn.png');

const SIZE = 60;

type BackButtonProps = {
  onPress: () => void;
};

/** Circular muted back button — sits beside the primary CTA in a screen's sticky bottom bar. */
function BackButton({onPress}: BackButtonProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}>
      <Image source={BACK_ICON} style={styles.icon} resizeMode="contain" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...shadows.sm,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default BackButton;
