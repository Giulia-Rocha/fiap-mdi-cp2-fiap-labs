// ============================================================
// app/index.js — Redirect inicial
// [CP2 - NOVO] Verifica sessão e redireciona:
//   - Usuário logado → /(app)
//   - Não logado     → /(auth)/login
// ============================================================

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { usuarioLogado, carregandoSessao } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (carregandoSessao) return;
    if (usuarioLogado) {
      router.replace('/labs');
    } else {
      router.replace('/login');
    }
  }, [usuarioLogado, carregandoSessao]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
