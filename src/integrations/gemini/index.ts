// Export tất cả các service và client Gemini
export { gemini, testGeminiConnection } from "./client";
export {
  getChatCompletion,
  createEmbeddings,
  analyzeText,
  getMajorRecommendation,
  getDetailedMajorAnalysis,
  type ChatMessage,
  type ChatCompletionOptions,
} from "./services";

// Utility function để kiểm tra API key có được cấu hình không
export function isGeminiConfigured(): boolean {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}
