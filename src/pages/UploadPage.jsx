import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Music,
  BookOpen,
  Users,
  Palette,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { processHeritageItem } from "../lib/gemini-service";
import { HERITAGE_TYPES, REGIONS, LANGUAGES } from "../utils/constants";
import FileUploader from "../components/FileUploader";
import ProcessingStatus from "../components/ProcessingStatus";

const iconMap = { Music, BookOpen, Users, Palette };

export default function UploadPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    region: "",
    language: "kazakh",
    text_content: "",
    audio_url: null,
    video_url: null,
    images: [],
    tags: [],
  });
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("pending");
  const [createdItemId, setCreatedItemId] = useState(null);

  const handleFileUploaded = (url, fileType, storagePath) => {
    if (storagePath === "audio") {
      setFormData((prev) => ({ ...prev, audio_url: url }));
    } else if (storagePath === "video") {
      setFormData((prev) => ({ ...prev, video_url: url }));
    } else if (storagePath === "images") {
      setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedType || !formData.title || !formData.region) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    setUploading(true);

    try {
      // Create record in database
      const { data, error } = await supabase
        .from("heritage_items")
        .insert([
          {
            type: selectedType,
            title: formData.title,
            description: formData.description,
            region: formData.region,
            language: formData.language,
            text_content: formData.text_content,
            audio_url: formData.audio_url,
            video_url: formData.video_url,
            images: formData.images,
            tags: formData.tags,
            processing_status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setCreatedItemId(data.id);
      setProcessing(true);
      setProcessingStatus("processing");

      // Start AI processing
      const result = await processHeritageItem(data.id);

      if (result.success) {
        setProcessingStatus("completed");
        setTimeout(() => {
          navigate(`/detail/${data.id}`);
        }, 2000);
      } else {
        setProcessingStatus("failed");
        alert("Ошибка обработки: " + result.error);
      }
    } catch (error) {
      console.error("Error creating item:", error);
      alert("Ошибка создания записи: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Выберите тип культурного наследия
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HERITAGE_TYPES.map((type) => {
          const IconComponent = iconMap[type.icon];
          const isSelected = selectedType === type.value;

          return (
            <button
              key={type.value}
              onClick={() => {
                setSelectedType(type.value);
                setStep(2);
              }}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
              }`}
            >
              <IconComponent
                className={`h-12 w-12 mb-4 ${isSelected ? "text-primary" : "text-gray-400"}`}
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {type.label_ru}
              </h3>
              <p className="text-gray-600 text-sm">{type.description_ru}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => {
    const typeInfo = HERITAGE_TYPES.find((t) => t.value === selectedType);

    return (
      <div>
        <button
          onClick={() => setStep(1)}
          className="flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к выбору типа
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Загрузите контент: {typeInfo?.label_ru}
        </h2>

        <div className="space-y-6">
          {/* Audio Upload for Songs */}
          {selectedType === "song" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Аудио файл *
              </label>
              <FileUploader
                onFileUploaded={handleFileUploaded}
                acceptedTypes="audio/*"
              />
              {formData.audio_url && (
                <p className="mt-2 text-sm text-green-600">✓ Аудио загружено</p>
              )}
            </div>
          )}

          {/* Text Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedType === "song"
                ? "Текст песни (опционально)"
                : "Текстовое содержание *"}
            </label>
            <textarea
              value={formData.text_content}
              onChange={(e) =>
                setFormData({ ...formData, text_content: e.target.value })
              }
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Введите текст..."
            />
          </div>

          {/* Images/Video Upload */}
          {(selectedType === "ritual" || selectedType === "craft") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фото или видео (опционально)
              </label>
              <FileUploader
                onFileUploaded={handleFileUploaded}
                acceptedTypes="image/*,video/*"
              />
              {formData.images.length > 0 && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Файлы загружены: {formData.images.length}
                </p>
              )}
            </div>
          )}

          <button
            onClick={() => setStep(3)}
            disabled={
              selectedType === "song"
                ? !formData.audio_url && !formData.text_content
                : !formData.text_content
            }
            className="w-full px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            Далее: Метаданные
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div>
      <button
        onClick={() => setStep(2)}
        className="flex items-center text-primary hover:text-primary/80 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Назад к загрузке файлов
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Добавьте метаданные
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Введите название..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Краткое описание..."
          />
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Регион *
          </label>
          <select
            value={formData.region}
            onChange={(e) =>
              setFormData({ ...formData, region: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Выберите регион</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Язык *
          </label>
          <div className="flex gap-4">
            {LANGUAGES.map((lang) => (
              <label key={lang.value} className="flex items-center">
                <input
                  type="radio"
                  value={lang.value}
                  checked={formData.language === lang.value}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="mr-2"
                />
                <span>{lang.label_ru}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || processing}
          className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-black rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg"
        >
          {uploading
            ? "Загрузка..."
            : processing
              ? "Обработка..."
              : "Загрузить и анализировать"}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= num
                        ? "bg-primary text-black"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {num}
                  </div>
                  {num < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${step > num ? "bg-primary" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          {!processing ? (
            <>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </>
          ) : (
            <div className="text-center py-12">
              <ProcessingStatus status={processingStatus} />
              {processingStatus === "completed" && (
                <div className="mt-6">
                  <p className="text-green-600 font-medium mb-4">
                    ✓ Обработка завершена успешно!
                  </p>
                  <button
                    onClick={() => navigate(`/detail/${createdItemId}`)}
                    className="px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90"
                  >
                    Просмотреть результат
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
