// ============================================================
// app/(auth)/_layout.js
// Layout para as telas de login e cadastro
// ============================================================

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#121212' },
      }}
    />
  );
}
