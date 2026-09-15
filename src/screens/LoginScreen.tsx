import React, {useMemo, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import TextField from '../components/TextField';
import {signIn, AuthResult} from '../services/auth';
import {colors, textStyles} from '../theme';
import {sanitizeEmail, validateEmail, validatePassword} from '../utils/validation';

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

  const footer = (
    <View style={styles.footerRow}>
      <BackButton onPress={onBack} />
      <Button
        label={isSubmitting ? 'Logging in...' : 'Log in'}
        onPress={handleLogin}
        disabled={!isFormValid}
        loading={isSubmitting}
        style={styles.footerCta}
      />
    </View>
  );

  return (
    <ScreenContainer footer={footer}>
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

      <Pressable onPress={onNavigateToSignUp} style={styles.footerLinkWrap} hitSlop={8}>
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.footerLink}>Create one</Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerCta: {
    flex: 1,
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
  footerLinkWrap: {
    alignItems: 'center',
    marginTop: 8,
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
