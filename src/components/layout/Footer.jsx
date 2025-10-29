import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">MuraAI</span>
            </div>
            <p className="text-gray-400 text-sm">
              Сохраним культурное наследие Казахстана с помощью искусственного интеллекта
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Главная</a></li>
              <li><a href="/catalog" className="hover:text-white transition-colors">Каталог</a></li>
              <li><a href="/upload" className="hover:text-white transition-colors">Добавить наследие</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-4">О проекте</h3>
            <p className="text-gray-400 text-sm mb-2">
              Проект создан для сохранения и популяризации казахского культурного наследия
            </p>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              Создано с <Heart className="h-3 w-3 text-red-500 fill-current" /> на хакатоне {currentYear}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {currentYear} MuraAI. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
