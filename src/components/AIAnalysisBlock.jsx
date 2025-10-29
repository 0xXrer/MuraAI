import { Sparkles, MapPin, Clock, Lightbulb, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function AIAnalysisBlock({ analysis }) {
  const [expandedSections, setExpandedSections] = useState({
    context: false,
    traditions: false
  });

  if (!analysis) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
        AI-анализ недоступен
      </div>
    );
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <Sparkles className="h-6 w-6 text-secondary" />
        <h2 className="text-2xl font-bold text-gray-900">AI-Анализ наследия</h2>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Краткое содержание</h3>
        <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Cultural Context */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('context')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-gray-900">Культурный контекст</h3>
          </div>
          {expandedSections.context ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {expandedSections.context && (
          <div className="px-4 pb-4">
            <p className="text-gray-700 leading-relaxed">{analysis.cultural_context}</p>
          </div>
        )}
      </div>

      {/* Historical Period */}
      <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
        <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Исторический период</h3>
          <p className="text-gray-700">{analysis.historical_period}</p>
        </div>
      </div>

      {/* Key Themes */}
      {analysis.key_themes && analysis.key_themes.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Основные темы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {analysis.key_themes.map((theme, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                <div className="h-2 w-2 bg-purple-500 rounded-full" />
                <span className="text-gray-700">{theme}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Region Origin */}
      {analysis.region_origin && (
        <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
          <MapPin className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Регион происхождения</h3>
            <p className="text-gray-700">{analysis.region_origin}</p>
          </div>
        </div>
      )}

      {/* Related Traditions */}
      {analysis.related_traditions && analysis.related_traditions.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('traditions')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Связанные традиции</h3>
            {expandedSections.traditions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {expandedSections.traditions && (
            <div className="px-4 pb-4 space-y-2">
              {analysis.related_traditions.map((tradition, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span className="text-gray-700">{tradition}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preservation Notes */}
      {analysis.preservation_notes && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Рекомендации по сохранению</h3>
          <p className="text-gray-700 leading-relaxed">{analysis.preservation_notes}</p>
        </div>
      )}

      {/* Tags */}
      {((analysis.tags_ru && analysis.tags_ru.length > 0) || (analysis.tags_kz && analysis.tags_kz.length > 0)) && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Теги</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.tags_ru && analysis.tags_ru.map((tag, idx) => (
              <span key={`ru-${idx}`} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {tag}
              </span>
            ))}
            {analysis.tags_kz && analysis.tags_kz.map((tag, idx) => (
              <span key={`kz-${idx}`} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
