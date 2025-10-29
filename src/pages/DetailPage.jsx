import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Eye,
  Copy,
  Share2,
  Music as MusicIcon,
  BookOpen,
  Users,
  Palette,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { HERITAGE_TYPES } from "../utils/constants";
import AIAnalysisBlock from "../components/AIAnalysisBlock";
import ProcessingStatus from "../components/ProcessingStatus";
import HeritageCard from "../components/HeritageCard";

const iconMap = { Music: MusicIcon, BookOpen, Users, Palette };

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadItem();
    }
  }, [id]);

  const loadItem = async () => {
    try {
      // Get item
      const { data, error } = await supabase
        .from("heritage_items")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setItem(data);

      // Increment views
      await supabase
        .from("heritage_items")
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq("id", id);

      // Load related items (same region or same type)
      const { data: related } = await supabase
        .from("heritage_items")
        .select("*")
        .or(`region.eq.${data.region},type.eq.${data.type}`)
        .neq("id", id)
        .limit(3);

      setRelatedItems(related || []);
    } catch (error) {
      console.error("Error loading item:", error);
      alert("Ошибка загрузки данных");
      navigate("/catalog");
    } finally {
      setLoading(false);
    }
  };

  const copyTranscription = () => {
    if (item?.transcription) {
      navigator.clipboard.writeText(item.transcription);
      alert("Транскрипция скопирована в буфер обмена");
    }
  };

  const shareItem = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Ссылка скопирована в буфер обмена");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Элемент не найден</p>
          <Link to="/catalog" className="text-primary hover:underline">
            Вернуться к каталогу
          </Link>
        </div>
      </div>
    );
  }

  const typeInfo = HERITAGE_TYPES.find((t) => t.value === item.type);
  const IconComponent = iconMap[typeInfo?.icon] || MusicIcon;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/catalog")}
          className="flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к каталогу
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-primary">
                      {typeInfo?.label_ru}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mt-1">
                      {item.title}
                    </h1>
                  </div>
                </div>

                <button
                  onClick={shareItem}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Поделиться"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{item.region}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(item.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{item.views_count || 0} просмотров</span>
                </div>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Описание
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            )}

            {/* Audio Player */}
            {item.audio_url && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Аудио</h2>
                <audio controls className="w-full">
                  <source src={item.audio_url} />
                  Ваш браузер не поддерживает аудио элемент.
                </audio>
              </div>
            )}

            {/* Video Player */}
            {item.video_url && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Видео</h2>
                <video controls className="w-full rounded-lg">
                  <source src={item.video_url} />
                  Ваш браузер не поддерживает видео элемент.
                </video>
              </div>
            )}

            {/* Images */}
            {item.images && item.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Изображения
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${item.title} - ${idx + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Transcription */}
            {item.transcription && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    Транскрипция
                  </h2>
                  <button
                    onClick={copyTranscription}
                    className="flex items-center text-sm text-primary hover:text-primary/80"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Скопировать
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {item.transcription}
                  </p>
                </div>
              </div>
            )}

            {/* AI Analysis */}
            {item.processing_status === "completed" && item.ai_analysis ? (
              <AIAnalysisBlock analysis={item.ai_analysis} />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <ProcessingStatus status={item.processing_status} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Items */}
            {relatedItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Похожее наследие
                </h2>
                <div className="space-y-4">
                  {relatedItems.map((relatedItem) => (
                    <HeritageCard key={relatedItem.id} item={relatedItem} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
