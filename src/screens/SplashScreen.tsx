import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {colors, fontFamily} from '../theme';

const TRAYA_TEXT = 'Traya.';
const CHAR_STAGGER_MS = 130;
const CHAR_ANIM_DURATION_MS = 260;

type SplashScreenProps = {
  onAnimationComplete?: () => void;
  holdDurationMs?: number;
};

function SplashScreen({
  onAnimationComplete,
  holdDurationMs = 700,
}: SplashScreenProps): React.JSX.Element {
  const characters = useMemo(() => TRAYA_TEXT.split(''), []);
  const animatedValues = useRef(
    characters.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const animations = animatedValues.map(value =>
      Animated.timing(value, {
        toValue: 1,
        duration: CHAR_ANIM_DURATION_MS,
        useNativeDriver: true,
      }),
    );

    const sequence = Animated.stagger(CHAR_STAGGER_MS, animations);
    let holdTimeout: ReturnType<typeof setTimeout>;

    sequence.start(({finished}) => {
      if (finished && onAnimationComplete) {
        holdTimeout = setTimeout(onAnimationComplete, holdDurationMs);
      }
    });

    return () => {
      sequence.stop();
      clearTimeout(holdTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        {characters.map((char, index) => {
          const animatedValue = animatedValues[index];
          const translateY = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [14, 0],
          });

          return (
            <Animated.Text
              key={`${char}-${index}`}
              style={[
                styles.character,
                {
                  opacity: animatedValue,
                  transform: [{translateY}],
                },
              ]}>
              {char}
            </Animated.Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRow: {
    flexDirection: 'row',
  },
  character: {
    fontSize: 48,
    fontFamily: fontFamily.extraBold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
