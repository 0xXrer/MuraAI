import { Link } from 'react-router-dom';
import { Music, BookOpen, Users, Palette, MapPin, Eye, Calendar } from 'lucide-react';
import { HERITAGE_TYPES } from '../utils/constants';

const iconMap = {
  Music, BookOpen, Users, Palette
};

export default function HeritageCard({ item }) {
  const typeInfo = HERITAGE_TYPES.find(t => t.value === item.type);
  const IconComponent = iconMap[typeInfo?.icon] || Music;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Link
      to={`/detail/${item.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">{typeInfo?.label_ru}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {item.description || 'Без описания'}
        </p>

        {/* Region */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{item.region}</span>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{item.views_count || 0}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(item.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
