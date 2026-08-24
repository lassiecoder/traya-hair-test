import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, fontFamily, textStyles} from '../theme';

const BACKDROP_FADE_MS = 200;
const SHEET_ENTRANCE_MS = 280;
const SHEET_EXIT_MS = 220;
/** Comfortably taller than any real screen, so the sheet always starts fully below the visible
 * area regardless of its own (content-dependent, unmeasured-at-animation-start) height. */
const SHEET_OFFSCREEN_OFFSET = Dimensions.get('window').height;

type SelectFieldProps = {
  label: string;
  placeholder: string;
  value: string | null;
  options: readonly string[];
  onChange: (value: string) => void;
  helperText?: string;
  error?: string;
  /**
   * Fired when the picker is dismissed (option picked, backdrop tapped, or hardware back) — use
   * it to mark the field as "touched" for validation. Firing on open instead would show the
   * "required" error the instant the sheet appears, before the user has had any chance to pick
   * something.
   */
  onClose?: () => void;
};

function SelectField({
  label,
  placeholder,
  value,
  options,
  onChange,
  helperText,
  error,
  onClose,
}: SelectFieldProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(0)).current;
  // Guards against a second dismiss (e.g. tapping an option right as the backdrop is also
  // tapped) re-running the close animation and firing onClose/setIsOpen twice.
  const isClosingRef = useRef(false);

  // Runs the entrance the moment the Modal becomes visible — the backdrop fades in on its own
  // timeline while only the sheet slides up, instead of animating together as one unit (which
  // made the dimmed backdrop itself appear to slide/scroll up the screen).
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    isClosingRef.current = false;
    backdropAnim.setValue(0);
    sheetAnim.setValue(0);
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: BACKDROP_FADE_MS,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: 1,
        duration: SHEET_ENTRANCE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function closePicker() {
    if (isClosingRef.current) {
      return;
    }
    isClosingRef.current = true;
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: BACKDROP_FADE_MS,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: 0,
        duration: SHEET_EXIT_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished) {
        setIsOpen(false);
        onClose?.();
      }
    });
  }

  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SHEET_OFFSCREEN_OFFSET, 0],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={[styles.input, error ? styles.inputError : null]} onPress={() => setIsOpen(true)}>
        <Text style={value ? styles.value : styles.placeholder}>{value ?? placeholder}</Text>
      </Pressable>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}

      <Modal visible={isOpen} transparent animationType="none" onRequestClose={closePicker}>
        <View style={styles.backdropContainer}>
          <Animated.View style={[styles.backdrop, {opacity: backdropAnim}]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closePicker} />
          </Animated.View>

          <Animated.View style={[styles.sheet, {transform: [{translateY: sheetTranslateY}]}]}>
            {options.map(option => (
              <Pressable
                key={option}
                style={styles.option}
                onPress={() => {
                  onChange(option);
                  closePicker();
                }}>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    ...textStyles.label,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.error,
  },
  value: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
  },
  placeholder: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.placeholder,
  },
  helperText: {
    ...textStyles.caption,
    marginTop: 8,
    color: colors.textMuted,
  },
  errorText: {
    ...textStyles.caption,
    marginTop: 8,
    color: colors.error,
  },
  backdropContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  // Absolutely positioned so it covers the full screen regardless of the sheet's own layout —
  // fades independently of the sheet's slide so it doesn't move/scroll along with it.
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 8,
    paddingBottom: 24,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  optionText: {
    fontSize: 17,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
});

export default SelectField;
