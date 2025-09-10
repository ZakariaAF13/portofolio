import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  // Set theme on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem('admin-theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    const initialTheme = storedTheme || 'system';
    setThemeState(initialTheme);
    
    // Apply theme
    applyTheme(initialTheme, systemPrefersDark);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system', mediaQuery.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const applyTheme = (theme: Theme, systemPrefersDark: boolean) => {
    const root = window.document.documentElement;
    const isDarkMode = theme === 'dark' || (theme === 'system' && systemPrefersDark);
    
    root.classList.remove(isDarkMode ? 'light' : 'dark');
    root.classList.add(isDarkMode ? 'dark' : 'light');
    
    setIsDark(isDarkMode);
  };

  const setTheme = (theme: Theme) => {
    localStorage.setItem('admin-theme', theme);
    setThemeState(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
