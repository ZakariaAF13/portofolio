import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translateByI18nLanguage } from '../utils/geminiTranslate';

interface LongContentProps {
  content: string;
  className?: string;
  cacheKey?: string; // optional stable key to avoid re-translation if content is same
}

export default function LongContent({ content, className = '', cacheKey }: LongContentProps) {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError('');
      try {
        const text = content?.trim() || '';
        if (!text) {
          setTranslated('');
          setLoading(false);
          return;
        }
        const out = await translateByI18nLanguage(text, i18n.language);
        if (!cancelled) setTranslated(out);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Translation failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [content, i18n.language, cacheKey]);

  if (loading) return <p className="text-sm text-gray-500">Translating...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className={className}>
      {translated.split('\n').map((p, idx) => (
        <p key={idx} className="mb-3 last:mb-0">{p}</p>
      ))}
    </div>
  );
}
