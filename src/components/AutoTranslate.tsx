import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText } from '../utils/geminiTranslate';

type AutoTranslateProps = {
  text: string;
  fieldName: string;
  onTranslate?: (translatedText: string) => void;
  className?: string;
};

export default function AutoTranslate({ 
  text, 
  fieldName, 
  onTranslate,
  className = '' 
}: AutoTranslateProps) {
  const { i18n } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!text.trim() || isTranslating) return;
    
    setIsTranslating(true);
    setError('');
    
    try {
      const sourceLang = i18n.language === 'id' ? 'en' : 'id';
      const targetLang = i18n.language === 'id' ? 'en' : 'id';
      const result = await translateText(text, sourceLang as 'id' | 'en', targetLang as 'id' | 'en');
      
      setTranslatedText(result);
      if (onTranslate) {
        onTranslate(result);
      }
    } catch (err) {
      console.error(`Error translating ${fieldName}:`, err);
      setError('Gagal menerjemahkan. Silakan coba lagi.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Reset translated text when text changes
  useEffect(() => {
    setTranslatedText('');
  }, [text]);

  // Don't show translate button if text is empty or already in the target language
  if (!text.trim() || i18n.language === 'id') {
    return <span className={className}>{text}</span>;
  }

  return (
    <div className={`relative group ${className}`}>
      {translatedText ? (
        <span>{translatedText}</span>
      ) : (
        <span className="opacity-70">{text}</span>
      )}
      
      {!translatedText && (
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          title="Terjemahkan ke bahasa Indonesia"
        >
          {isTranslating ? 'Menerjemahkan...' : '🇮🇩'}
        </button>
      )}
      
      {error && (
        <div className="text-red-500 text-xs mt-1">
          {error}
        </div>
      )}
    </div>
  );
}
