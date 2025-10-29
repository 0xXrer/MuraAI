import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateText, translateBatch } from '../lib/translate-service';

// Cache для хранения переводов
const translationCache = new Map();
const CACHE_KEY_PREFIX = 'muraai_translation_';

/**
 * Загружает кэш переводов из localStorage
 */
function loadCacheFromStorage() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        const value = localStorage.getItem(key);
        if (value) {
          translationCache.set(key.replace(CACHE_KEY_PREFIX, ''), value);
        }
      }
    });
  } catch (error) {
    console.error('Error loading translation cache:', error);
  }
}

/**
 * Сохраняет перевод в кэш и localStorage
 */
function saveCacheToStorage(cacheKey, translation) {
  try {
    translationCache.set(cacheKey, translation);
    localStorage.setItem(CACHE_KEY_PREFIX + cacheKey, translation);
  } catch (error) {
    console.error('Error saving translation cache:', error);
  }
}

/**
 * Генерирует ключ для кэша
 */
function getCacheKey(text, targetLang, sourceLang) {
  return `${sourceLang || 'auto'}:${targetLang}:${text}`;
}

// Загружаем кэш при инициализации
loadCacheFromStorage();

/**
 * Хук для real-time перевода текста
 * @param {string} text - Текст для перевода
 * @param {string} sourceLang - Исходный язык (по умолчанию 'ru')
 * @returns {string} - Переведенный текст
 */
export function useTranslate(text, sourceLang = 'ru') {
  const { currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Если текущий язык = исходный язык, возвращаем оригинал
    if (currentLanguage === sourceLang || !text) {
      setTranslatedText(text);
      return;
    }

    const cacheKey = getCacheKey(text, currentLanguage, sourceLang);

    // Проверяем кэш
    if (translationCache.has(cacheKey)) {
      setTranslatedText(translationCache.get(cacheKey));
      return;
    }

    // Переводим текст
    setIsLoading(true);
    translateText(text, currentLanguage, sourceLang)
      .then(translated => {
        saveCacheToStorage(cacheKey, translated);
        setTranslatedText(translated);
      })
      .catch(error => {
        console.error('Translation error:', error);
        setTranslatedText(text); // Fallback к оригиналу
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [text, currentLanguage, sourceLang]);

  return translatedText;
}

/**
 * Хук для пакетного перевода массива текстов
 * @param {string[]} texts - Массив текстов для перевода
 * @param {string} sourceLang - Исходный язык
 * @returns {Object} - { translatedTexts, isLoading }
 */
export function useTranslateBatch(texts, sourceLang = 'ru') {
  const { currentLanguage } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState(texts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLanguage === sourceLang || !texts || texts.length === 0) {
      setTranslatedTexts(texts);
      return;
    }

    // Проверяем, какие тексты уже в кэше
    const textsToTranslate = [];
    const cachedResults = [];

    texts.forEach((text, index) => {
      const cacheKey = getCacheKey(text, currentLanguage, sourceLang);
      if (translationCache.has(cacheKey)) {
        cachedResults[index] = translationCache.get(cacheKey);
      } else {
        textsToTranslate.push({ text, index });
      }
    });

    // Если все тексты в кэше
    if (textsToTranslate.length === 0) {
      setTranslatedTexts(cachedResults);
      return;
    }

    // Переводим только те, которых нет в кэше
    setIsLoading(true);
    translateBatch(
      textsToTranslate.map(item => item.text),
      currentLanguage,
      sourceLang
    )
      .then(translations => {
        const result = [...texts];
        translations.forEach((translation, i) => {
          const originalIndex = textsToTranslate[i].index;
          result[originalIndex] = translation;

          // Сохраняем в кэш
          const cacheKey = getCacheKey(textsToTranslate[i].text, currentLanguage, sourceLang);
          saveCacheToStorage(cacheKey, translation);
        });

        // Добавляем кэшированные результаты
        cachedResults.forEach((cached, index) => {
          if (cached) result[index] = cached;
        });

        setTranslatedTexts(result);
      })
      .catch(error => {
        console.error('Batch translation error:', error);
        setTranslatedTexts(texts);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [texts, currentLanguage, sourceLang]);

  return { translatedTexts, isLoading };
}

/**
 * Хук для очистки кэша переводов
 */
export function useClearTranslationCache() {
  return useCallback(() => {
    translationCache.clear();
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('Translation cache cleared');
  }, []);
}
