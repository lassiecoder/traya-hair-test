import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { colors, fontFamily, textStyles } from '../theme';

const DOCTORS_IMAGE_WIDTH = 260;
const DOCTORS_IMAGE_HEIGHT = 177;
const TEXT_ENTRANCE_MS = 420;
const TEXT_ENTRANCE_OFFSET = 32;

type AssessmentIntroScreenProps = {
  /** Full name captured at signup — only the first name is greeted with. */
  fullName?: string;
  onContinue: () => void;
};

/** Social-proof interstitial shown right after signup — "Start hair test" is the only way into the questionnaire. */
function AssessmentIntroScreen({
  fullName,
  onContinue,
}: AssessmentIntroScreenProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const firstName = fullName?.trim().split(' ')[0];
  const textEntranceAnim = useRef(new Animated.Value(0)).current;

  // Runs once on mount — slides the greeting/title/subtitle block down into place from just
  // above its resting position, so it reads as loading in from the top rather than just
  // appearing. No opacity fade paired with it: the codebase's other entrance animations found
  // that a fade against this pale background washes out for a frame and reads as a flicker.
  useEffect(() => {
    Animated.timing(textEntranceAnim, {
      toValue: 1,
      duration: TEXT_ENTRANCE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textTranslateY = textEntranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-TEXT_ENTRANCE_OFFSET, 0],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.textBlock, { paddingTop: insets.top }]}>
        <Animated.View style={{ transform: [{ translateY: textTranslateY }] }}>
          <Text style={styles.username}>
            Hey, <Text style={styles.usernameHighlight}>{firstName ?? 'there'}</Text>!
          </Text>
          <Text style={styles.title}>
            Let's find out what is actually causing your hair fall.
          </Text>
          <Text style={styles.subtitle}>
            A doctor-reviewed assessment that reads your hair, your body and your
            history, then builds one plan around all three.
          </Text>
        </Animated.View>
      </View>

      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/images/doctors.png')}
          style={styles.doctorsImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.ctaWrapper}>
        <Button label="Start hair test" onPress={onContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: colors.background,
  },
  textBlock: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  username: {
    ...textStyles.body,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  usernameHighlight: {
    fontFamily: fontFamily.bold,
    fontSize: 17,
  },
  title: {
    ...textStyles.title,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textMuted,
  },
  imageWrapper: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  ctaWrapper: {
    paddingHorizontal: 24,
    marginBottom: 44,
  },
  doctorsImage: {
    width: DOCTORS_IMAGE_WIDTH,
    height: DOCTORS_IMAGE_HEIGHT,
  },
});

export default AssessmentIntroScreen;
