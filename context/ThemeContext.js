import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  const STORAGE_KEY_THEME = '@fiaplabs:theme';

  useEffect(() => {
    async function loadTheme() {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    }
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem(STORAGE_KEY_THEME, newTheme ? 'dark' : 'light');
  };

  const colors = {
    primary: '#ED145B',
    background: isDark ? '#121212' : '#F5F5F5',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#121212',
    textSecondary: isDark ? '#A0A0A0' : '#666666',
    border: isDark ? '#333333' : '#E0E0E0',
    input: isDark ? '#2D2D2D' : '#FFFFFF',
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
