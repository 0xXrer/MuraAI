// Heritage Types
export const HERITAGE_TYPES = [
  {
    value: 'song',
    label_ru: 'Народная песня',
    label_kz: 'Халық әні',
    icon: 'Music',
    description_ru: 'Казахские народные песни и мелодии',
    description_kz: 'Қазақ халық әндері мен күйлері'
  },
  {
    value: 'story',
    label_ru: 'Легенда',
    label_kz: 'Аңыз',
    icon: 'BookOpen',
    description_ru: 'Народные легенды, сказки и эпосы',
    description_kz: 'Халық аңыздары, ертегілер және эпостар'
  },
  {
    value: 'ritual',
    label_ru: 'Обряд',
    label_kz: 'Дәстүр',
    icon: 'Users',
    description_ru: 'Традиционные обряды и церемонии',
    description_kz: 'Дәстүрлі рәсімдер мен салттар'
  },
  {
    value: 'craft',
    label_ru: 'Ремесло',
    label_kz: 'Қолөнер',
    icon: 'Palette',
    description_ru: 'Традиционные ремесла и искусство',
    description_kz: 'Дәстүрлі қолөнер және өнер'
  }
];

// Regions of Kazakhstan (14 областей + 3 города республиканского значения)
export const REGIONS = [
  'Акмолинская',
  'Актюбинская',
  'Алматинская',
  'Атырауская',
  'Восточно-Казахстанская',
  'Жамбылская',
  'Жетысуская',
  'Западно-Казахстанская',
  'Карагандинская',
  'Костанайская',
  'Кызылординская',
  'Мангистауская',
  'Павлодарская',
  'Северо-Казахстанская',
  'Туркестанская',
  'Улытауская',
  'Абайская',
  'Астана',
  'Алматы',
  'Шымкент'
];

// Languages
export const LANGUAGES = [
  { value: 'kazakh', label_ru: 'Казахский', label_kz: 'Қазақ тілі' },
  { value: 'russian', label_ru: 'Русский', label_kz: 'Орыс тілі' }
];

// Processing Status
export const PROCESSING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Processing Status Labels
export const PROCESSING_STATUS_LABELS = {
  pending: { ru: 'Ожидает обработки', kz: 'Өңдеуді күтуде', color: 'yellow' },
  processing: { ru: 'AI анализирует...', kz: 'AI талдауда...', color: 'blue' },
  completed: { ru: 'Анализ завершен', kz: 'Талдау аяқталды', color: 'green' },
  failed: { ru: 'Ошибка обработки', kz: 'Өңдеу қатесі', color: 'red' }
};

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE: 100 * 1024 * 1024, // 100 MB in bytes
  AUDIO_FORMATS: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/m4a'],
  VIDEO_FORMATS: ['video/mp4', 'video/webm', 'video/ogg'],
  IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  TEXT_FORMATS: ['text/plain']
};

// Supabase Storage Paths
export const STORAGE_PATHS = {
  AUDIO: 'audio',
  VIDEO: 'video',
  IMAGES: 'images',
  TEXT: 'text'
};
