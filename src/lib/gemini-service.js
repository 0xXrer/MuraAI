import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "./supabase";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    "Missing Gemini API key! Please add VITE_GEMINI_API_KEY to .env.local",
  );
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

/**
 * Транскрибирует аудио файл используя Gemini 1.5 Flash
 * @param {string} audioUrl - URL аудио файла
 * @returns {Promise<string>} - Текст транскрипции
 */
export async function transcribeAudio(audioUrl) {
  try {
    console.log("Starting audio transcription...");

    // Используем gemini-2.0-flash-exp для multimodal задач
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Fetch audio file as blob
    const response = await fetch(audioUrl);
    const audioBlob = await response.blob();

    // Convert blob to base64
    const base64Audio = await blobToBase64(audioBlob);

    // Определяем MIME тип
    const mimeType = audioBlob.type || "audio/mpeg";

    const prompt = `Транскрибируй этот аудиофайл. Это казахская народная песня или рассказ.
Предоставь ТОЛЬКО текст транскрипции, без комментариев и пояснений.
Если текст на казахском языке, транскрибируй на казахском.
Если текст на русском языке, транскрибируй на русском.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Audio,
          mimeType: mimeType,
        },
      },
    ]);

    const transcription = result.response.text();
    console.log("Transcription completed");

    return transcription;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error(`Ошибка транскрипции: ${error.message}`);
  }
}

/**
 * Анализирует культурное наследие с помощью Gemini AI
 * @param {string} content - Текстовое содержание для анализа
 * @param {string} type - Тип наследия (song/story/ritual/craft)
 * @returns {Promise<Object>} - Объект с результатами анализа
 */
export async function analyzeWithGemini(content, type) {
  try {
    console.log("Starting AI analysis...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const typeLabels = {
      song: "народная песня",
      story: "легенда/сказка",
      ritual: "обряд/традиция",
      craft: "ремесло/искусство",
    };

    const prompt = `Ты - эксперт по культурному наследию Казахстана. Проанализируй это культурное наследие.

Тип: ${typeLabels[type] || type}
Содержание: ${content}

Предоставь ДЕТАЛЬНЫЙ анализ в формате JSON (отвечай ТОЛЬКО JSON, без markdown блоков и без дополнительного текста):
{
  "summary": "краткое содержание на русском языке (2-3 предложения)",
  "cultural_context": "детальный культурный и исторический контекст (4-5 предложений)",
  "historical_period": "предполагаемый исторический период (например: 19 век, начало 20 века, древние времена)",
  "key_themes": ["основная тема 1", "основная тема 2", "основная тема 3"],
  "region_origin": "наиболее вероятный регион происхождения в Казахстане",
  "related_traditions": ["связанная традиция 1", "связанная традиция 2"],
  "preservation_notes": "рекомендации по сохранению и популяризации этого наследия",
  "tags_kz": ["тег1", "тег2", "тег3", "тег4", "тег5"],
  "tags_ru": ["тег1", "тег2", "тег3", "тег4", "тег5"]
}

Будь конкретным. Используй свои знания о казахской культуре. Отвечай ТОЛЬКО JSON без дополнительного форматирования.`;

    const result = await model.generateContent(prompt);
    let analysisText = result.response.text();

    // Убираем markdown блоки если есть
    analysisText = analysisText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Парсим JSON
    const analysis = JSON.parse(analysisText);

    console.log("AI analysis completed");
    return analysis;
  } catch (error) {
    console.error("Error analyzing with Gemini:", error);
    throw new Error(`Ошибка анализа AI: ${error.message}`);
  }
}

/**
 * Главная функция обработки элемента наследия
 * @param {string} itemId - ID элемента в базе данных
 * @returns {Promise<Object>} - Результат обработки
 */
export async function processHeritageItem(itemId) {
  try {
    console.log(`Processing heritage item: ${itemId}`);

    // 1. Получаем элемент из базы данных
    const { data: item, error: fetchError } = await supabase
      .from("heritage_items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (fetchError) {
      throw new Error(`Ошибка получения данных: ${fetchError.message}`);
    }

    // 2. Обновляем статус на "processing"
    await supabase
      .from("heritage_items")
      .update({ processing_status: "processing" })
      .eq("id", itemId);

    let contentToAnalyze = "";
    let transcription = null;

    // 3. Определяем, что нужно обработать
    if (item.audio_url) {
      // Если есть аудио - транскрибируем
      console.log("Transcribing audio...");
      transcription = await transcribeAudio(item.audio_url);
      contentToAnalyze = transcription;
    } else if (item.text_content) {
      // Если есть текст - используем его
      contentToAnalyze = item.text_content;
    } else if (item.description) {
      // Если только описание - используем его
      contentToAnalyze = item.description;
    } else {
      throw new Error("Нет контента для анализа");
    }

    // 4. Анализируем контент с помощью Gemini
    console.log("Analyzing content with Gemini...");
    const analysis = await analyzeWithGemini(contentToAnalyze, item.type);

    // 5. Объединяем теги
    const allTags = [
      ...new Set([
        ...(analysis.tags_ru || []),
        ...(analysis.tags_kz || []),
        ...(item.tags || []),
      ]),
    ];

    // 6. Обновляем запись в базе данных
    const { data: updatedItem, error: updateError } = await supabase
      .from("heritage_items")
      .update({
        transcription: transcription,
        ai_analysis: analysis,
        tags: allTags,
        processing_status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Ошибка обновления: ${updateError.message}`);
    }

    console.log("Processing completed successfully");
    return {
      success: true,
      item: updatedItem,
    };
  } catch (error) {
    console.error("Error processing heritage item:", error);

    // Обновляем статус на "failed"
    await supabase
      .from("heritage_items")
      .update({
        processing_status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId);

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Helper функция для конвертации blob в base64
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Убираем префикс data:...;base64,
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
