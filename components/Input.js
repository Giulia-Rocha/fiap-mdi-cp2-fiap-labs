import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  erro,
  ...rest
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}

      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: colors.input, 
            color: colors.text, 
            borderColor: colors.border 
          },
          erro ? { borderColor: colors.primary } : null
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        {...rest}
      />

      {erro ? <Text style={[styles.erroText, { color: colors.primary }]}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
  },
  erroText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
