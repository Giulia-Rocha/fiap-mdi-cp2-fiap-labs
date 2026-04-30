// ============================================================
// [CP2 - NOVO] components/Button.js
// Botão reutilizável com suporte a estado de loading
// (desabilitado enquanto há erros de validação ou carregando).
// ============================================================

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary' | 'outline' | 'danger'
  style,
}) {
  const isDisabled = disabled || loading;

  const bgColor = {
    primary: '#ED145B',
    outline: 'transparent',
    danger:  '#FF3B30',
  }[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColor },
        variant === 'outline' && styles.outline,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderWidth: 1,
    borderColor: '#ED145B',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textOutline: {
    color: '#ED145B',
  },
});
