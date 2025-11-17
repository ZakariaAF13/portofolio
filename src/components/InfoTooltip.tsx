import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InfoTooltipProps {
  theme: 'dark' | 'light' | string;
  duration?: number; // Duration in milliseconds, default 3000 (3 seconds)
  inline?: boolean; // Display inline instead of fixed position
}

export default function InfoTooltip({ theme, duration = 3000, inline = false }: InfoTooltipProps) {
  const [show, setShow] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      // Wait for exit animation to complete before hiding
      setTimeout(() => setShow(false), 500);
    }, duration);

    return () => clearTimeout(exitTimer);
  }, [duration]);

  if (!show) return null;

  const isDark = theme === 'dark';

  if (inline) {
    return (
      <div className={`flex items-center gap-2 transition-all duration-500 ${
        isExiting 
          ? 'opacity-0 translate-x-4' 
          : 'opacity-100 translate-x-0 animate-slide-in-left'
      }`}>
        <div
          className={`flex items-center justify-center w-6 h-6 rounded-full ${
            isDark ? 'bg-blue-600' : 'bg-blue-500'
          }`}
        >
          <Info className="w-4 h-4 text-white" />
        </div>
        <span
          className={`text-sm font-medium whitespace-nowrap ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {t('projects.clickDetails')}
        </span>
      </div>
    );
  }

  return (
    <div className={`fixed top-6 right-6 z-50 transition-all duration-500 ${
      isExiting 
        ? 'opacity-0 translate-x-20' 
        : 'opacity-100 translate-x-0 animate-slide-in-left'
    }`}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-xl transition-all duration-300 ${
          isDark 
            ? 'bg-slate-800 border border-slate-600' 
            : 'bg-white border border-gray-200'
        }`}
      >
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isDark ? 'bg-blue-600' : 'bg-blue-500'
          }`}
        >
          <Info className="w-5 h-5 text-white" />
        </div>
        <span
          className={`text-sm font-medium whitespace-nowrap ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          {t('projects.clickDetails')}
        </span>
      </div>
    </div>
  );
}
