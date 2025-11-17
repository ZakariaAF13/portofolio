/*
  Gemini translate utility with local cache.
  - Requires environment variable: VITE_GEMINI_API_KEY
  - Provides translateWithGemini(text, targetLang) that:
      1) checks localStorage cache
      2) calls Gemini API if not cached
      3) stores result to cache
*/

export type SupportedTarget = 'Indonesian' | 'English';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function getApiKey(): string {
  // Debug: Log environment info
  if (typeof window === 'undefined') {
    console.log('Running in Node.js environment');
  } else {
    console.log('Running in browser environment');
  }

  // 1. Try Vite environment (browser)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const key = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (key) {
      console.log('Using API key from Vite environment');
      return key;
    }
  }
  
  // 2. Try Node.js environment (for SSR/Testing)
  if (typeof process !== 'undefined' && process.env) {
    const key = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (key) {
      console.log('Using API key from Node.js environment');
      return key;
    }
  }

  // 3. Try window._env_ (for production builds)
  if (typeof window !== 'undefined' && (window as any)._env_?.VITE_GEMINI_API_KEY) {
    return (window as any)._env_.VITE_GEMINI_API_KEY;
  }

  // Error handling
  const errorMessage = [
    '❌ VITE_GEMINI_API_KEY is not defined.',
    'Please check your .env file and ensure it contains:', 
    'VITE_GEMINI_API_KEY=your_api_key_here',
    'And restart your development server.'
  ].join('\n');
  
  console.error(errorMessage);
  throw new Error('Missing VITE_GEMINI_API_KEY');
}

function safeHash(input: string): string {
  // Simple fast hash for cache key (not crypto-strong)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit int
  }
  return hash.toString(16);
}

function getCache() {
  try {
    return JSON.parse(localStorage.getItem('gemini_translate_cache') || '{}');
  } catch {
    return {} as Record<string, string>;
  }
}

function setCache(cache: Record<string, string>) {
  try {
    localStorage.setItem('gemini_translate_cache', JSON.stringify(cache));
  } catch {}
}

export async function translateWithGemini(
  text: string, 
  targetLang: SupportedTarget,
  retries = 3,
  delayMs = 1000
): Promise<string> {
  const normalized = (text || '').trim();
  if (!normalized) return '';

  // Gunakan cache yang lebih spesifik dengan format dan versi
  const cacheKey = safeHash(`v1:${targetLang}:${normalized}`);
  const cache = getCache();
  
  // Jika hasil terjemahan ada di cache, kembalikan
  if (cache[cacheKey]) {
    console.log('Using cached translation for:', cacheKey.substring(0, 20) + '...');
    return cache[cacheKey];
  }

  // Deteksi bahasa sumber berdasarkan karakter
  const sourceLang = /[\u0400-\u04FF]/.test(normalized) ? 'Russian' : 
                    /[\u4E00-\u9FFF]/.test(normalized) ? 'Chinese' :
                    /[\u3040-\u30FF]/.test(normalized) ? 'Japanese' :
                    /[\uAC00-\uD7AF]/.test(normalized) ? 'Korean' :
                    /[\u0E00-\u0E7F]/.test(normalized) ? 'Thai' :
                    /[\u0600-\u06FF]/.test(normalized) ? 'Arabic' :
                    /^[\u0000-\u007F]*$/.test(normalized) ? 'English' : 'Indonesian';

  // Jika bahasa target sama dengan sumber, kembalikan teks asli
  if (sourceLang.toLowerCase() === targetLang.toLowerCase()) {
    return normalized;
  }

  const prompt = `Please translate the following text from ${sourceLang} to ${targetLang}. 
Preserve all formatting, line breaks, and special characters. If the text contains placeholders like {{variable}}, 
do not translate the content inside the placeholders.

Text to translate:
${normalized}`;

  const body = {
    contents: [{
      parts: [{ text: prompt }],
    }],
    generationConfig: {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(getApiKey())}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        // Exponential backoff
        const delay = Math.min(10000, Math.pow(2, 4 - retries) * delayMs);
        console.warn(`Rate limited, retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return translateWithGemini(text, targetLang, retries - 1, delayMs * 2);
      }
      
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    let result = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.() || '';
    
    // Bersihkan hasil terjemahan jika perlu
    if (result.startsWith('"') && result.endsWith('"')) {
      result = result.slice(1, -1);
    }

    if (!result) {
      throw new Error('Empty translation result from Gemini');
    }

    // Simpan ke cache
    try {
      cache[cacheKey] = result;
      setCache(cache);
    } catch (cacheError) {
      console.warn('Failed to save to cache:', cacheError);
    }

    return result;
  } catch (error) {
    console.error('Translation error:', error);
    if (retries > 0) {
      const delay = Math.min(10000, Math.pow(2, 4 - retries) * delayMs);
      console.warn(`Retrying after error (${retries} retries left)...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return translateWithGemini(text, targetLang, retries - 1, delayMs * 2);
    }
    throw error;
  }
}

export async function translateByI18nLanguage(text: string, i18nLang: string): Promise<string> {
  const target: SupportedTarget = i18nLang === 'id' ? 'Indonesian' : 'English';
  return translateWithGemini(text, target);
}

/**
 * Translate text from one language to another
 * @param text - Text to translate
 * @param sourceLang - Source language ('id' or 'en')
 * @param targetLang - Target language ('id' or 'en')
 */
export async function translateText(
  text: string,
  sourceLang: 'id' | 'en',
  targetLang: 'id' | 'en'
): Promise<string> {
  if (sourceLang === targetLang) return text;
  
  const target: SupportedTarget = targetLang === 'id' ? 'Indonesian' : 'English';
  return translateWithGemini(text, target);
}
