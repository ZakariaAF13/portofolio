import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';

interface ScrollDownHintProps {
  targetRef: React.RefObject<HTMLElement>;
  theme: 'dark' | 'light' | string;
}

export default function ScrollDownHint({ targetRef, theme }: ScrollDownHintProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const update = () => {
      try {
        const canScroll = el.scrollHeight > el.clientHeight + 2; // allow small rounding
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
        setShow(canScroll && !atBottom);
      } catch {
        setShow(false);
      }
    };

    update();
    el.addEventListener('scroll', update, { passive: true } as any);
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [targetRef]);

  if (!show) return null;

  const isDark = theme === 'dark';

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50">
      <div
        className={`pointer-events-auto inline-flex items-center justify-center w-9 h-9 rounded-full shadow-lg animate-bounce transition-colors ${
          isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white text-gray-800 hover:bg-gray-100'
        } border ${isDark ? 'border-slate-600' : 'border-gray-200'}`}
        title="Scroll down"
      >
        <ArrowDown className="w-5 h-5" />
      </div>
    </div>
  );
}
