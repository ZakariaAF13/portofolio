/**
 * Utility functions for handling bilingual content
 */

/**
 * Get the correct text based on current language
 * @param item - The object containing bilingual fields
 * @param field - The base field name (e.g., 'title', 'description')
 * @param lang - Current language ('en' or 'id')
 * @param fallbackField - Optional fallback field name if bilingual fields don't exist
 * @returns The text in the correct language
 */
export function getBilingualText(
  item: any,
  field: string,
  lang: string,
  fallbackField?: string
): string {
  if (!item) return '';
  
  const idField = `${field}Id`;
  const enField = `${field}En`;
  
  if (lang === 'id') {
    return item[idField] || item[fallbackField || field] || '';
  }
  return item[enField] || item[fallbackField || field] || '';
}

/**
 * Get bilingual field object with both languages
 * @param item - The object containing bilingual fields
 * @param field - The base field name
 * @returns Object with 'id' and 'en' properties
 */
export function getBilingualField(item: any, field: string) {
  if (!item) return { id: '', en: '' };
  
  const idField = `${field}Id`;
  const enField = `${field}En`;
  
  return {
    id: item[idField] || item[field] || '',
    en: item[enField] || item[field] || ''
  };
}

/**
 * Check if an item has bilingual fields
 * @param item - The object to check
 * @param field - The base field name
 * @returns True if bilingual fields exist
 */
export function hasBilingualField(item: any, field: string): boolean {
  if (!item) return false;
  
  const idField = `${field}Id`;
  const enField = `${field}En`;
  
  return !!(item[idField] && item[enField]);
}
