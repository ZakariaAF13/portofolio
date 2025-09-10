import React from 'react';
import { Sun, Moon } from 'lucide-react';
import type { Theme } from '../types';

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const handleToggle = () => {
    onThemeChange(theme === 'light' ? 'dark' : 'light');
  };

  const iconColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const bgColor = theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200';

  return (
    <button
      onClick={handleToggle}
      aria-label={theme === 'light' ? 'Toggle dark mode' : 'Toggle light mode'}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${bgColor}`}
    >
      {theme === 'light' ? (
        <Moon size={18} className={iconColor} />
      ) : (
        <Sun size={18} className={iconColor} />
      )}
    </button>
  );
}