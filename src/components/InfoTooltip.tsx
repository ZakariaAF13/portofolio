import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  theme: 'dark' | 'light' | string;
  duration?: number; // Duration in milliseconds, default 3000 (3 seconds)
}

export default function InfoTooltip({ theme, duration = 3000 }: InfoTooltipProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!show) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in">
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
          Click for details
        </span>
      </div>
    </div>
  );
}
