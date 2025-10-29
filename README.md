# MuraAI - Сохранение культурного наследия Казахстана с AI

MuraAI - платформа для оцифровки и анализа культурного наследия Казахстана с использованием искусственного интеллекта. Проект создан для хакатона и использует только бесплатные инструменты.

## 🌟 Возможности

- **Загрузка наследия**: Аудио, текст, видео, изображения
- **AI-транскрипция**: Автоматическая транскрипция аудио с помощью Google Gemini
- **AI-анализ**: Детальный культурный и исторический анализ
- **Каталог**: Поиск и фильтрация по типам и регионам
- **Детальные страницы**: Полная информация с AI-анализом

## 🛠 Технологический стек

### Frontend
- **React 18** + **Vite** - Быстрая разработка и сборка
- **Tailwind CSS** - Современный дизайн
- **React Router** - Навигация
- **Lucide React** - Иконки

### Backend & Database
- **Supabase** (Free Tier)
  - PostgreSQL база данных
  - Storage для файлов
  - Realtime подписки
  - Row Level Security

### AI
- **Google Gemini 1.5 Flash** (БЕСПЛАТНО)
  - 15 запросов/минуту
  - 1 миллион токенов/день
  - Multimodal (аудио + текст)

## 📋 Требования

- Node.js 18+ и npm
- Аккаунт Supabase (бесплатный)
- Google Gemini API ключ (бесплатный)

## 🚀 Установка и запуск

### 1. Клонировать репозиторий

```bash
git clone <repository-url>
cd muraai
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить Supabase

#### 3.1 Создать проект
1. Перейти на https://supabase.com
2. Создать новый проект (бесплатно)
3. Дождаться завершения инициализации

#### 3.2 Выполнить SQL схему
1. Перейти в **SQL Editor**
2. Создать новый запрос
3. Скопировать и выполнить содержимое файла `supabase-schema.sql`

#### 3.3 Создать Storage Bucket
1. Перейти в **Storage**
2. Создать новый bucket с именем `heritage-files`
3. Сделать его **публичным** (Public bucket)
4. Установить максимальный размер файла: 100 MB

#### 3.4 Получить ключи API
1. Перейти в **Settings** → **API**
2. Скопировать:
   - `Project URL`
   - `anon public` ключ

### 4. Получить Google Gemini API ключ

1. Перейти на https://aistudio.google.com/app/apikey
2. Нажать **Get API Key**
3. Создать новый ключ (бесплатно, без карты)
4. Скопировать ключ

### 5. Настроить переменные окружения

Создать файл `.env.local` в корне проекта:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Важно**: Замените значения на свои реальные ключи!

### 6. Запустить приложение

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

## 📁 Структура проекта

```
muraai/
├── src/
│   ├── components/          # React компоненты
│   │   ├── layout/         # Header, Footer
│   │   ├── HeritageCard.jsx
│   │   ├── AIAnalysisBlock.jsx
│   │   ├── FileUploader.jsx
│   │   └── ProcessingStatus.jsx
│   ├── pages/              # Страницы
│   │   ├── HomePage.jsx
│   │   ├── CatalogPage.jsx
│   │   ├── UploadPage.jsx
│   │   └── DetailPage.jsx
│   ├── lib/                # Библиотеки и сервисы
│   │   ├── supabase.js     # Supabase клиент
│   │   └── gemini-service.js # AI сервис
│   ├── utils/              # Утилиты
│   │   └── constants.js    # Константы
│   ├── App.jsx             # Главный компонент
│   ├── main.jsx           # Точка входа
│   └── index.css          # Стили
├── public/                # Статические файлы
├── supabase-schema.sql    # SQL схема для Supabase
├── .env.example           # Пример переменных окружения
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎯 Использование

### Добавление элемента наследия

1. Перейти на страницу "Добавить наследие"
2. Выбрать тип наследия (песня, легенда, обряд, ремесло)
3. Загрузить файлы (аудио, видео, изображения) или ввести текст
4. Заполнить метаданные (название, описание, регион, язык)
5. Нажать "Загрузить и анализировать"
6. Дождаться AI-анализа (обычно 10-30 секунд)
7. Просмотреть результат с детальным анализом

### Просмотр каталога

1. Перейти в "Каталог"
2. Использовать поиск по ключевым словам
3. Фильтровать по типу наследия и региону
4. Переключать вид (сетка/список)
5. Кликнуть на карточку для детального просмотра

### Детальная страница

- Просмотр всей информации об элементе
- Прослушивание аудио / просмотр видео
- Чтение транскрипции
- Изучение AI-анализа с культурным контекстом
- Просмотр связанных элементов наследия

## 🤖 AI Функции

### Транскрипция аудио

Gemini 1.5 Flash автоматически транскрибирует казахские и русские аудиозаписи.

### AI-Анализ включает:

- **Краткое содержание**: Основная суть
- **Культурный контекст**: Исторический и культурный фон
- **Исторический период**: Предполагаемая эпоха
- **Основные темы**: Ключевые мотивы
- **Регион происхождения**: Наиболее вероятный регион
- **Связанные традиции**: Похожие культурные элементы
- **Рекомендации**: Советы по сохранению
- **Теги**: Автоматически сгенерированные теги на казахском и русском

## 🎨 Дизайн

### Цветовая схема

- **Primary** (#0EA5E9) - Небо и простор Казахстана
- **Secondary** (#8B5CF6) - AI и технологии
- **Accent** (#F59E0B) - Золото и казахские орнаменты

### Адаптивность

- Desktop: полная функциональность
- Tablet: адаптированный layout
- Mobile: оптимизированный интерфейс с бургер-меню

## 📊 База данных

### Таблица heritage_items

```sql
- id: UUID (primary key)
- type: song | story | ritual | craft
- title: TEXT
- description: TEXT
- region: TEXT
- language: kazakh | russian
- audio_url: TEXT
- video_url: TEXT
- text_content: TEXT
- images: TEXT[] (массив)
- transcription: TEXT
- ai_analysis: JSONB
- processing_status: pending | processing | completed | failed
- tags: TEXT[] (массив)
- views_count: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## 🔒 Безопасность

### Row Level Security (RLS)

Настроены политики для публичного доступа:
- **SELECT**: Все могут читать
- **INSERT**: Все могут создавать (для хакатона)
- **UPDATE**: Все могут обновлять (для хакатона)

**Для продакшена**: Добавить аутентификацию и ограничить права!

## 🚀 Деплой на Vercel (бесплатно)

### 1. Подготовка

```bash
# Проверить, что .env.local в .gitignore
echo ".env.local" >> .gitignore

# Закоммитить код
git add .
git commit -m "Initial commit"
git push
```

### 2. Деплой на Vercel

1. Перейти на https://vercel.com
2. Импортировать Git репозиторий
3. В **Environment Variables** добавить:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GEMINI_API_KEY`
4. Нажать **Deploy**

### 3. Готово!

Приложение будет доступно по URL типа `https://muraai.vercel.app`

## 📈 Лимиты бесплатных планов

### Supabase Free Tier
- ✅ 500 MB база данных
- ✅ 1 GB bandwidth
- ✅ 1 GB file storage
- ✅ 50,000 monthly active users

### Google Gemini Free Tier
- ✅ 15 запросов в минуту
- ✅ 1 миллион токенов в день
- ✅ 1500 запросов в день

### Vercel Free Tier
- ✅ 100 GB bandwidth
- ✅ Unlimited sites
- ✅ Automatic HTTPS

## 🐛 Troubleshooting

### Ошибка "Missing Supabase environment variables"
- Проверьте, что файл `.env.local` существует
- Убедитесь, что ключи начинаются с `VITE_`
- Перезапустите dev сервер

### Ошибка загрузки файлов
- Проверьте, что bucket `heritage-files` создан
- Убедитесь, что bucket публичный
- Проверьте лимит размера файла (100 MB)

### AI не обрабатывает элементы
- Проверьте Google Gemini API ключ
- Убедитесь, что не превышены лимиты (15 req/min)
- Проверьте console для ошибок

### Ошибки сборки
```bash
# Очистить кеш и переустановить зависимости
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 🤝 Вклад

Проект открыт для вклада! Основные направления:

- Добавление новых типов наследия
- Улучшение AI-промптов для более точного анализа
- Поддержка дополнительных языков
- Улучшение дизайна и UX
- Оптимизация производительности

## 📄 Лицензия

MIT License - свободное использование для образовательных и коммерческих целей.

## 👥 Команда

Создано для хакатона 2025 с целью сохранения культурного наследия Казахстана.

## 🔗 Полезные ссылки

- [Supabase Docs](https://supabase.com/docs)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Сохраним культурное наследие Казахстана вместе! 🇰🇿✨**
