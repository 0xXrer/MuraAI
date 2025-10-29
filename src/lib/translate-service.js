/**
 * Google Translate API Service
 * Сервис для перевода текстов используя Google Translate API
 */

const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

if (!GOOGLE_TRANSLATE_API_KEY) {
  console.warn('Missing Google Translate API key! Add VITE_GOOGLE_TRANSLATE_API_KEY to .env.local');
}

/**
 * Переводит текст с одного языка на другой используя Google Translate API
 * @param {string} text - Текст для перевода
 * @param {string} targetLang - Целевой язык (ru, kk, en)
 * @param {string} sourceLang - Исходный язык (по умолчанию auto)
 * @returns {Promise<string>} - Переведенный текст
 */
export async function translateText(text, targetLang, sourceLang = 'auto') {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.error('Google Translate API key is not configured');
    return text;
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        ...(sourceLang !== 'auto' && { source: sourceLang })
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Возвращаем оригинальный текст при ошибке
  }
}

/**
 * Переводит массив текстов
 * @param {string[]} texts - Массив текстов для перевода
 * @param {string} targetLang - Целевой язык
 * @param {string} sourceLang - Исходный язык
 * @returns {Promise<string[]>} - Массив переведенных текстов
 */
export async function translateBatch(texts, targetLang, sourceLang = 'auto') {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.error('Google Translate API key is not configured');
    return texts;
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: texts,
        target: targetLang,
        ...(sourceLang !== 'auto' && { source: sourceLang })
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.translations.map(t => t.translatedText);
  } catch (error) {
    console.error('Error translating texts:', error);
    return texts;
  }
}

/**
 * Определяет язык текста
 * @param {string} text - Текст для определения языка
 * @returns {Promise<string>} - Код языка (ru, kk, en, и т.д.)
 */
export async function detectLanguage(text) {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.error('Google Translate API key is not configured');
    return 'ru';
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${GOOGLE_TRANSLATE_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text
      })
    });

    if (!response.ok) {
      throw new Error(`Language detection error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.detections[0][0].language;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'ru';
  }
}
