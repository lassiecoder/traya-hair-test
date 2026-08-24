import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import {colors, fontFamily, textStyles} from '../theme';

type TextFieldProps = TextInputProps & {
  label: string;
  helperText?: string;
  error?: string;
};

function TextField({label, helperText, error, style, ...inputProps}: TextFieldProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.placeholder}
        {...inputProps}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
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
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.error,
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
});

export default TextField;
