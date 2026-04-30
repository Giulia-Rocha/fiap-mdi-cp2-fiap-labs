import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  Image,
  TouchableWithoutFeedback,
  useWindowDimensions
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function CustomSidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { usuarioLogado, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();

  const sidebarWidth = width * 0.75;

  // Usando useRef para manter os valores animados estáveis entre re-renders
  const animValue = useRef(new Animated.Value(-sidebarWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => {
    const toValue = isOpen ? -sidebarWidth : 0;
    const opacityToValue = isOpen ? 0 : 1;

    Animated.parallel([
      Animated.timing(animValue, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: opacityToValue,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    setIsOpen(!isOpen);
  };

  const navigateTo = (path) => {
    // Se já estiver na rota, apenas fecha a sidebar
    if (pathname === path) {
      toggleSidebar();
      return;
    }

    // Fecha a sidebar com animação antes de navegar
    const toValue = -sidebarWidth;
    const opacityToValue = 0;

    Animated.parallel([
      Animated.timing(animValue, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: opacityToValue,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsOpen(false);
      router.replace(path);
    });
  };

  const handleLogout = () => {
    // Fecha a sidebar e faz logout
    const toValue = -sidebarWidth;
    const opacityToValue = 0;

    Animated.parallel([
      Animated.timing(animValue, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: opacityToValue,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(async () => {
      setIsOpen(false);
      await logout();
      router.replace('/login');
    });
  };

  // Fecha sidebar ao mudar de rota externamente (ex: botão de voltar)
  useEffect(() => {
    if (isOpen) {
      const toValue = -sidebarWidth;
      const opacityToValue = 0;

      Animated.parallel([
        Animated.timing(animValue, {
          toValue,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: opacityToValue,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsOpen(false);
      });
    }
  }, [pathname]);

  const menuItems = [
    { label: 'Laboratórios', icon: 'flask-outline', path: '/labs' },
    { label: 'Minhas Reservas', icon: 'calendar-outline', path: '/reservas' },
    { label: 'Meu Perfil', icon: 'person-outline', path: '/perfil' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header Fixo - ZIndex 10 */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton} activeOpacity={0.7}>
          <Ionicons name="menu" size={30} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>FIAP Labs</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton} activeOpacity={0.7}>
          <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Conteúdo da Tela */}
      <View style={{ flex: 1 }}>
        {children}
      </View>

      {/* Overlay Escuro - ZIndex 20 */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
        </TouchableWithoutFeedback>
      )}

      {/* Sidebar Animada - ZIndex 30 */}
      <Animated.View style={[
        styles.sidebar, 
        { 
          width: sidebarWidth,
          transform: [{ translateX: animValue }],
          backgroundColor: colors.card,
          borderRightColor: colors.border
        }
      ]}>
        <View style={styles.sidebarContent}>
          <View style={[styles.profileSection, { borderBottomColor: colors.border }]}>
            <Image 
              source={require('../assets/fiaplogo.png')} 
              style={styles.logo}
            />
            <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
              Olá, {usuarioLogado?.nome || 'Usuário'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]} numberOfLines={1}>
              {usuarioLogado?.email}
            </Text>
          </View>

          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity 
                key={item.path} 
                style={[
                  styles.menuItem,
                  pathname === item.path && { backgroundColor: isDark ? '#2D2D2D' : '#F0F0F0' }
                ]} 
                onPress={() => navigateTo(item.path)}
              >
                <Ionicons 
                  name={item.icon} 
                  size={22} 
                  color={pathname === item.path ? colors.primary : colors.textSecondary} 
                />
                <Text style={[
                  styles.menuLabel, 
                  { color: pathname === item.path ? colors.primary : colors.text }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.logoutButton, { borderTopColor: colors.border }]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.primary} />
            <Text style={[styles.logoutText, { color: colors.primary }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 8,
    marginRight: -8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 20,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 30,
    borderRightWidth: 1,
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 60,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 140,
    height: 45,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  menuLabel: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    borderTopWidth: 1,
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
