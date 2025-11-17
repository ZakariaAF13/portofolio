export type SupportedLang = 'id' | 'en';

// Simple language detection based on character patterns
function simpleDetectLanguage(text: string): SupportedLang {
  if (!text) return 'id';
  
  // Check for common English words
  const englishWords = /\b(the|is|are|was|were|have|has|will|can|could|should|would|this|that|with|from|they|what|about|which|their|there|when|where|who|how)\b/gi;
  const englishMatches = (text.match(englishWords) || []).length;
  
  // Check for Indonesian words
  const indonesianWords = /\b(yang|dan|di|ke|untuk|dari|ini|itu|dengan|atau|adalah|pada|oleh|akan|dapat|sudah|telah|belum|lebih|juga|tidak|ada)\b/gi;
  const indonesianMatches = (text.match(indonesianWords) || []).length;
  
  // If more English words found, assume English
  if (englishMatches > indonesianMatches) {
    return 'en';
  }
  
  // Default to Indonesian
  return 'id';
}

export async function detectLanguage(
  text: string,
  signal?: AbortSignal,
): Promise<SupportedLang | null> {
  if (!text) return null;
  
  // Use simple pattern-based detection (no API needed)
  return simpleDetectLanguage(text);
}

export async function translateText(
  text: string,
  source: SupportedLang,
  target: SupportedLang,
  signal?: AbortSignal,
): Promise<string> {
  if (!text || source === target) return text;
  
  try {
    // Use MyMemory Translation API (free, no CORS issues)
    // API: https://mymemory.translated.net/doc/spec.php
    const sourceLang = source === 'id' ? 'id-ID' : 'en-US';
    const targetLang = target === 'id' ? 'id-ID' : 'en-US';
    
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    
    const resp = await fetch(url, { signal });
    
    if (!resp.ok) {
      console.warn('Translation failed, using original text');
      return text;
    }
    
    const data = await resp.json();
    
    // MyMemory response format: { responseData: { translatedText: "..." } }
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    
    return text;
  } catch (error) {
    console.warn('Translation error:', error);
    return text;
  }
}

export async function translateBatch(
  texts: string[],
  source: SupportedLang,
  target: SupportedLang,
  signal?: AbortSignal,
): Promise<string[]> {
  const results: string[] = [];
  for (const t of texts) {
    // Sequential to avoid rate limits on public instances
    // Could be parallelized if using a dedicated server/quota
    // eslint-disable-next-line no-await-in-loop
    results.push(await translateText(t, source, target, signal));
  }
  return results;
}
