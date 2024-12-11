import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    listItemBackground: string;
    text: string;
    primary: string;
  };
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(colorScheme || 'dark');

  useEffect(() => {
    setTheme(colorScheme || 'light');
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const colors = {
    light: {
      background: '#FFFFFF',
      listItemBackground: '#F5F5F5',
      text: '#000000',
      primary: '#007AFF',
    },
    dark: {
      background: '#000000',
      listItemBackground: '#1C1C1E',
      text: '#FFFFFF',
      primary: '#0A84FF',
    },
  };

  const value = {
    theme,
    toggleTheme,
    colors: colors[theme],
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

