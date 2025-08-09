import { gemini } from "./client";

// Interface cho chat request với Gemini
export interface ChatMessage {
  role: "user" | "model";
  parts: string;
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  prompt: string;
}

// Service để gọi Gemini Generate Content API
export async function getChatCompletion(options: ChatCompletionOptions) {
  try {
    const {
      model = "gemini-1.5-flash",
      temperature = 0.7,
      maxOutputTokens = 1000,
      prompt,
    } = options;

    const generativeModel = gemini.getGenerativeModel({
      model,
      generationConfig: {
        temperature,
        maxOutputTokens,
      },
    });

    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      data: text,
      usage: {
        promptTokens: 0, // Gemini không trả về token count chi tiết như OpenAI
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  } catch (error) {
    console.error("Lỗi khi gọi Gemini Generate Content:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

// Service để tạo embeddings (Gemini không có embedding API tương tự OpenAI)
export async function createEmbeddings(text: string) {
  try {
    // Gemini không có embedding API riêng, có thể dùng text generation để tạo summary
    const prompt = `Tạo một tóm tắt ngắn gọn (không quá 100 từ) cho văn bản sau: ${text}`;

    const result = await getChatCompletion({ prompt });

    return {
      success: true,
      data: result.data, // Trả về summary thay vì embedding vector
      usage: result.usage,
    };
  } catch (error) {
    console.error("Lỗi khi tạo embeddings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

// Service để phân tích văn bản với prompt tùy chỉnh
export async function analyzeText(text: string, analysisPrompt: string) {
  const fullPrompt = `${analysisPrompt}\n\nVăn bản cần phân tích: ${text}`;
  return getChatCompletion({ prompt: fullPrompt });
}

// Service đặc biệt cho ứng dụng tư vấn ngành học
export async function getMajorRecommendation(userProfile: {
  interests: string[];
  skills: string[];
  personality: string[];
  academicPreferences: string[];
}) {
  const prompt = `
Bạn là một chuyên gia tư vấn định hướng nghề nghiệp. Hãy phân tích hồ sơ của học sinh và đưa ra gợi ý về các ngành học phù hợp.

Thông tin học sinh:
- Sở thích: ${userProfile.interests.join(", ")}
- Kỹ năng: ${userProfile.skills.join(", ")}
- Tính cách: ${userProfile.personality.join(", ")}
- Sở thích học tập: ${userProfile.academicPreferences.join(", ")}

Hãy:
1. Phân tích điểm mạnh và đặc điểm của học sinh
2. Đề xuất 3-5 ngành học phù hợp nhất
3. Giải thích lý do tại sao mỗi ngành phù hợp
4. Đưa ra lời khuyên về hướng phát triển

Trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu.
  `;

  return getChatCompletion({ prompt });
}
