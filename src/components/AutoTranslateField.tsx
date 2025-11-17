import { useState, useEffect } from 'react';
import { translateWithGemini } from '../utils/geminiTranslate';

export default function AutoTranslateField({
  value,
  onChange,
  name,
  className = '',
  placeholder = '',
  rows = 3,
  required = false,
  onTranslateComplete = () => {}
}: {
  value: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  onTranslateComplete?: () => void;
}) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslateButton, setShowTranslateButton] = useState(false);
  const [targetLang, setTargetLang] = useState('');

  // Deteksi bahasa asli dan target
  useEffect(() => {
    // Logika deteksi bahasa sederhana
    const isEnglish = /[a-zA-Z]/.test(value);
    setTargetLang(isEnglish ? 'Indonesian' : 'English');
    
    // Tampilkan tombol terjemahan jika teks cukup panjang
    setShowTranslateButton(value.trim().length > 10);
  }, [value]);

  const handleTranslate = async () => {
    if (!value.trim() || isTranslating) return;
    
    try {
      setIsTranslating(true);
      
      const translatedText = await translateWithGemini(
        value,
        targetLang as 'English' | 'Indonesian'
      );
      
      if (translatedText) {
        onChange(translatedText);
        onTranslateComplete();
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="relative w-full">
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
      
      {showTranslateButton && !isTranslating && (
        <button
          type="button"
          onClick={handleTranslate}
          className="absolute bottom-2 right-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded flex items-center"
          title={`Translate to ${targetLang}`}
        >
          <span className="mr-1">🌐</span>
          {targetLang}
        </button>
      )}
      
      {isTranslating && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 flex items-center">
          <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Translating...
        </div>
      )}
    </div>
  );
}
