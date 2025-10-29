import { useState, useRef } from "react";
import { Upload, X, File, Loader } from "lucide-react";
import {
  supabase,
  generateUniqueFilename,
  getStoragePath,
} from "../lib/supabase";

export default function FileUploader({
  onFileUploaded,
  acceptedTypes,
  maxSize = 100 * 1024 * 1024,
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    // Validate file size
    if (selectedFile.size > maxSize) {
      alert(
        `Файл слишком большой. Максимальный размер: ${maxSize / 1024 / 1024}MB`,
      );
      return;
    }

    setFile(selectedFile);
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const uniqueFilename = generateUniqueFilename(file.name);
      const storagePath = getStoragePath(file.type);
      const filePath = `${storagePath}/${uniqueFilename}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("heritage-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("heritage-files").getPublicUrl(filePath);

      setProgress(100);
      onFileUploaded(publicUrl, file.type, storagePath);

      // Reset after successful upload
      setTimeout(() => {
        setFile(null);
        setUploading(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Ошибка загрузки файла: " + error.message);
      setUploading(false);
      setProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={acceptedTypes}
        />

        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              Перетащите файл сюда
            </p>
            <p className="text-sm text-gray-500">или</p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
          >
            Выбрать файл
          </button>

          <p className="text-xs text-gray-400">
            Максимальный размер: {maxSize / 1024 / 1024}MB
          </p>
        </div>
      </div>

      {/* File Preview */}
      {file && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            {!uploading && (
              <button
                onClick={removeFile}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Загрузка...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          {!uploading && (
            <button
              onClick={uploadFile}
              className="mt-4 w-full px-4 py-2 bg-green-600 text-black rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Загрузить файл</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
