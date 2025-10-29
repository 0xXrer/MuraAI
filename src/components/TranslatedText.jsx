import { useTranslate } from '../hooks/useTranslate';

/**
 * Компонент для автоматического перевода текста в реальном времени
 * @param {string} text - Текст для перевода
 * @param {string} sourceLang - Исходный язык (по умолчанию 'ru')
 * @param {string} as - HTML элемент для рендеринга (по умолчанию 'span')
 * @param {string} className - CSS классы
 * @param {Object} props - Дополнительные props
 */
export default function TranslatedText({
  text,
  sourceLang = 'ru',
  as: Component = 'span',
  className,
  ...props
}) {
  const translatedText = useTranslate(text, sourceLang);

  return (
    <Component className={className} {...props}>
      {translatedText}
    </Component>
  );
}

/**
 * Компонент для перевода с плавной анимацией загрузки
 */
export function TranslatedTextAnimated({
  text,
  sourceLang = 'ru',
  as: Component = 'span',
  className,
  loadingClassName = 'opacity-50 animate-pulse',
  ...props
}) {
  const translatedText = useTranslate(text, sourceLang);
  const isLoading = translatedText === text && translatedText !== '';

  return (
    <Component
      className={`${className || ''} ${isLoading ? loadingClassName : ''}`.trim()}
      {...props}
    >
      {translatedText}
    </Component>
  );
}
