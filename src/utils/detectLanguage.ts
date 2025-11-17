/**
 * Simple language detection based on common Indonesian words
 * Returns 'id' for Indonesian, 'en' for English
 */
export function detectLanguage(text: string): 'id' | 'en' {
  const normalized = text.toLowerCase();
  
  // Common Indonesian words/patterns
  const indonesianIndicators = [
    'yang', 'dan', 'dengan', 'untuk', 'adalah', 'ini', 'itu',
    'saya', 'kami', 'kita', 'mereka', 'dia',
    'dapat', 'bisa', 'akan', 'sudah', 'telah',
    'dalam', 'pada', 'dari', 'ke', 'oleh',
    'tidak', 'belum', 'jangan',
    'pengalaman', 'pekerjaan', 'perusahaan', 'projek', 'aplikasi',
    'menggunakan', 'membangun', 'membuat', 'mengembangkan',
    'tahun', 'bulan', 'hari'
  ];
  
  // Count Indonesian indicators
  let indonesianScore = 0;
  for (const indicator of indonesianIndicators) {
    if (normalized.includes(indicator)) {
      indonesianScore++;
    }
  }
  
  // If we found 2 or more Indonesian words, consider it Indonesian
  return indonesianScore >= 2 ? 'id' : 'en';
}
