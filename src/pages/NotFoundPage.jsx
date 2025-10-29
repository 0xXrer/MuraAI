import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../locales/translations';

export default function NotFoundPage() {
  const { currentLanguage } = useLanguage();
  const t = useTranslations(currentLanguage);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('notFound')}
        </h1>
        <p className="text-gray-600 mb-4">{t('pageNotFound')}</p>
        <Link to="/" className="text-primary hover:underline">
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
}
