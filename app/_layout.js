// ============================================================
// app/_layout.js — Layout raiz
// [CP2 - NOVO] Envolve toda a navegação com AuthProvider
// para que o contexto de autenticação fique disponível
// globalmente (incluindo as rotas (auth) e (app)).
// ============================================================

import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { ReservaProvider } from '../context/ReservaContext';
import { ThemeProvider } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ReservaProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </ReservaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
