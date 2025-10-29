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
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslations } from "../locales/translations";
import TranslatedText from "../components/TranslatedText";

const iconMap = { Music: MusicIcon, BookOpen, Users, Palette };

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const t = useTranslations(currentLanguage);
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
      alert(t("transcriptionCopied"));
    }
  };

  const shareItem = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert(t("linkCopied"));
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
          <p className="text-xl text-gray-600 mb-4">{t("itemNotFound")}</p>
          <Link to="/catalog" className="text-primary hover:underline">
            {t("backToCatalog")}
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
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/catalog")}
          className="flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("backToCatalog")}
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
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
                    <TranslatedText
                      text={item.title}
                      sourceLang="ru"
                      as="h1"
                      className="text-3xl font-bold text-gray-900 mt-1"
                    />
                  </div>
                </div>

                <button
                  onClick={shareItem}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={t("share")}
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
                  <span>
                    {item.views_count || 0} {t("views")}
                  </span>
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
                  {t("description")}
                </h2>
                <TranslatedText
                  text={item.description}
                  sourceLang="ru"
                  as="p"
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                />
              </div>
            )}

            {/* Audio Player */}
            {item.audio_url && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {t("audio")}
                </h2>
                <audio controls className="w-full">
                  <source src={item.audio_url} />
                  {t("browserNotSupport")} {t("audioElement")}.
                </audio>
              </div>
            )}

            {/* Video Player */}
            {item.video_url && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {t("video")}
                </h2>
                <video controls className="w-full rounded-lg">
                  <source src={item.video_url} />
                  {t("browserNotSupport")} {t("videoElement")}.
                </video>
              </div>
            )}

            {/* Images */}
            {item.images && item.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {t("images")}
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
                    {t("transcription")}
                  </h2>
                  <button
                    onClick={copyTranscription}
                    className="flex items-center text-sm text-primary hover:text-primary/80"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {t("copy")}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <TranslatedText
                    text={item.transcription}
                    sourceLang="ru"
                    as="p"
                    className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  />
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
                  {t("relatedHeritage")}
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
