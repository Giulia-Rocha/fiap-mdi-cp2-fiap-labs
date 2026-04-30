import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import CustomSidebar from '../../components/CustomSidebar';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function AppLayout() {
  const { isDark, colors } = useTheme();
  const { usuarioLogado, carregandoSessao } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!carregandoSessao && !usuarioLogado) {
      router.replace('/login');
    }
  }, [usuarioLogado, carregandoSessao]);

  if (carregandoSessao || !usuarioLogado) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <CustomSidebar>
        <Slot />
      </CustomSidebar>
    </>
  );
}
