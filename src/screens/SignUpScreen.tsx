import React, {useMemo, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import SelectField from '../components/SelectField';
import TextField from '../components/TextField';
import {signUp, AuthResult} from '../services/auth';
import {colors, textStyles} from '../theme';
import {Gender, SignUpFormData} from '../types/user';
import {sanitizeFullName, validateFullName, validateGender} from '../utils/validation';

const GENDER_OPTIONS: readonly Gender[] = ['Male', 'Female', 'Prefer not to say'];

type FieldName = keyof SignUpFormData;

type SignUpScreenProps = {
  onSignUpSuccess: (user: AuthResult) => void;
  onNavigateToLogin: () => void;
};

function SignUpScreen({onSignUpSuccess, onNavigateToLogin}: SignUpScreenProps): React.JSX.Element {
  const [form, setForm] = useState<SignUpFormData>({
    fullName: '',
    gender: null,
  });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    fullName: false,
    gender: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldErrors = useMemo(
    () => ({
      fullName: validateFullName(form.fullName),
      gender: validateGender(form.gender),
    }),
    [form],
  );

  const isFormValid = Object.values(fieldErrors).every(error => !error);

  function updateField<K extends FieldName>(key: K, value: SignUpFormData[K]) {
    setForm(previous => ({...previous, [key]: value}));
  }

  function markTouched(field: FieldName) {
    setTouched(previous => ({...previous, [field]: true}));
  }

  function errorFor(field: FieldName): string | undefined {
    return touched[field] ? fieldErrors[field] : undefined;
  }

  async function handleContinue() {
    if (!isFormValid || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const user = await signUp({
        fullName: form.fullName.trim(),
        gender: form.gender as Gender,
      });
      onSignUpSuccess(user);
    } catch {
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // DEV ONLY — bypasses the form entirely for faster iteration on downstream
  // screens. Delete this handler and the button below once Firebase auth
  // replaces the local stub in services/auth.ts.
  function handleSkipForDev() {
    onSignUpSuccess({userId: 'dev-skip', fullName: 'Dev User'});
  }

  return (
    <ScreenContainer>
      {/* flex: 1 so this absorbs any leftover height in the scroll area, pinning the block below
          it to the bottom of the screen on tall/short-content devices alike — on short content it
          sits flush with the bottom, on small devices where the form itself needs the space it
          simply scrolls, exactly like the rest of the screen already does. */}
      <View style={styles.formSection}>
        <Text style={styles.title}>First, let's set up your profile.</Text>
        <Text style={styles.subtitle}>
          Your doctor needs a file to write the diagnosis into. Takes twenty seconds, then straight to the
          test.
        </Text>
        <View style={styles.divider} />

        <TextField
          label="Full name"
          value={form.fullName}
          onChangeText={text => updateField('fullName', sanitizeFullName(text))}
          onBlur={() => markTouched('fullName')}
          error={errorFor('fullName')}
          autoCapitalize="words"
          autoComplete="name"
        />
        <SelectField
          label="Gender"
          placeholder="Select gender"
          value={form.gender}
          options={GENDER_OPTIONS}
          onChange={value => updateField('gender', value as Gender)}
          onClose={() => markTouched('gender')}
          error={errorFor('gender')}
          helperText={
            errorFor('gender') ? undefined : 'Sets which hair-loss pattern scale your assessment uses.'
          }
        />
      </View>

      <View>
        <Text style={styles.legalText}>
          By creating an account you agree to the <Text style={styles.legalLink}>terms</Text> and{' '}
          <Text style={styles.legalLink}>privacy policy</Text>. We never share your assessment.
        </Text>

        <Button
          label={isSubmitting ? 'Continuing...' : 'Continue'}
          onPress={handleContinue}
          disabled={!isFormValid}
          loading={isSubmitting}
          style={styles.submitButton}
        />

        <Pressable onPress={onNavigateToLogin} style={styles.footer} hitSlop={8}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Log in</Text>
          </Text>
        </Pressable>

        {/* DEV ONLY — remove with handleSkipForDev once Firebase auth is wired up. */}
        <Pressable onPress={handleSkipForDev} style={styles.devSkip} hitSlop={8}>
          <Text style={styles.devSkipText}>Skip for now (dev)</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formSection: {
    flex: 1,
  },
  title: {
    ...textStyles.title,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textMuted,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 28,
  },
  legalText: {
    ...textStyles.caption,
    lineHeight: 18,
    color: colors.textMuted,
    marginBottom: 24,
  },
  legalLink: {
    ...textStyles.captionEmphasis,
    color: colors.textPrimary,
  },
  submitButton: {
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...textStyles.caption,
    color: colors.textMuted,
  },
  footerLink: {
    ...textStyles.captionEmphasis,
    color: colors.textPrimary,
  },
  // DEV ONLY — remove alongside handleSkipForDev.
  devSkip: {
    alignItems: 'center',
    marginTop: 16,
  },
  devSkipText: {
    ...textStyles.caption,
    color: '#946200',
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;
