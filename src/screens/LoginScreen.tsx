import React, {useMemo, useState} from 'react';
import {Alert, Image, Pressable, StyleSheet, Text} from 'react-native';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import TextField from '../components/TextField';
import {signIn, AuthResult} from '../services/auth';
import {colors, textStyles} from '../theme';
import {sanitizeEmail, validateEmail, validatePassword} from '../utils/validation';

const BACK_ICON = require('../../assets/images/back-btn.png');

type FieldName = 'email' | 'password';

type LoginScreenProps = {
  onLoginSuccess: (user: AuthResult) => void;
  onNavigateToSignUp: () => void;
  onBack: () => void;
};

/**
 * No design spec was provided for this screen yet — styled to match
 * SignUpScreen so the app feels consistent until a real design lands.
 */
function LoginScreen({onLoginSuccess, onNavigateToSignUp, onBack}: LoginScreenProps): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({email: false, password: false});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldErrors = useMemo(
    () => ({
      email: validateEmail(email),
      password: validatePassword(password),
    }),
    [email, password],
  );

  const isFormValid = Object.values(fieldErrors).every(error => !error);

  function markTouched(field: FieldName) {
    setTouched(previous => ({...previous, [field]: true}));
  }

  function errorFor(field: FieldName): string | undefined {
    return touched[field] ? fieldErrors[field] : undefined;
  }

  async function handleLogin() {
    if (!isFormValid || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const user = await signIn({email: email.trim(), password});
      onLoginSuccess(user);
    } catch {
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      <Pressable onPress={onBack} style={styles.backButton} hitSlop={8}>
        <Image source={BACK_ICON} style={styles.backIcon} resizeMode="contain" />
      </Pressable>

      <Text style={styles.title}>Welcome back.</Text>
      <Text style={styles.subtitle}>Log in to pick up where you left off.</Text>

      <TextField
        label="Email"
        value={email}
        onChangeText={text => setEmail(sanitizeEmail(text))}
        onBlur={() => markTouched('email')}
        error={errorFor('email')}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        onBlur={() => markTouched('password')}
        error={errorFor('password')}
        secureTextEntry
        autoComplete="password"
      />

      <Button
        label={isSubmitting ? 'Logging in...' : 'Log in'}
        onPress={handleLogin}
        disabled={!isFormValid}
        loading={isSubmitting}
        style={styles.submitButton}
      />

      <Pressable onPress={onNavigateToSignUp} style={styles.footer} hitSlop={8}>
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.footerLink}>Create one</Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  backIcon: {
    width: 22,
    height: 22,
  },
  title: {
    ...textStyles.title,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textMuted,
    marginBottom: 28,
  },
  submitButton: {
    marginTop: 8,
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
});

export default LoginScreen;
