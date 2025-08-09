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

// Service phân tích chuyên sâu cho một ngành học cụ thể
export async function getDetailedMajorAnalysis(
  major: {
    id: string;
    name_vi: string;
    name_en: string;
    description: string;
    traits: number[];
    skills?: string[];
    curriculum?: {
      [key: string]: Array<{
        code: string;
        name: string;
        credits: number;
      }>;
    };
  },
  userProfile: {
    name: string;
    preferences: string[];
    traits: Record<string, number>;
    scores: Record<string, number>;
    favorites: string[];
    orientation: string;
    habits: string;
  }
) {
  const prompt = `
Bạn là một chuyên gia tư vấn giáo dục với nhiều năm kinh nghiệm. Hãy phân tích sâu về việc học sinh này có phù hợp với ngành học được đề xuất hay không và đưa ra lời khuyên cụ thể.

THÔNG TIN NGÀNH HỌC:
- Tên ngành: ${major.name_vi} (${major.name_en})
- Mô tả: ${major.description}
- Kỹ năng chính: ${major.skills?.join(", ") || "Chưa có thông tin"}
- Các môn học quan trọng: ${
    major.curriculum
      ? Object.values(major.curriculum)
          .flat()
          .slice(0, 8)
          .map((subject) => subject.name)
          .join(", ")
      : "Chưa có thông tin"
  }

THÔNG TIN HỌC SINH:
- Tên: ${userProfile.name}
- Sở thích/Quan tâm: ${userProfile.preferences.join(", ")}
- Điểm số các môn (thang 10):
  + Toán: ${userProfile.scores.math}
  + Văn: ${userProfile.scores.literature}
  + Tiếng Anh: ${userProfile.scores.english}
  + Tin học: ${userProfile.scores.informatics}
  + Vật lý: ${userProfile.scores.physics}
  + Hóa học: ${userProfile.scores.chemistry}
- Đặc điểm tính cách (thang 5):
  + Tư duy logic: ${userProfile.traits.logic}
  + Sáng tạo: ${userProfile.traits.creativity}
  + Giao tiếp: ${userProfile.traits.communication}
  + Tỉ mỉ: ${userProfile.traits.meticulous}
  + Lãnh đạo: ${userProfile.traits.leadership}
  + Kiên nhẫn: ${userProfile.traits.patience}
- Môn học yêu thích: ${userProfile.favorites.join(", ")}
- Định hướng: ${userProfile.orientation}
- Thói quen học tập: ${userProfile.habits}

YÊU CẦU PHÂN TÍCH:
Hãy trả về CHÍNH XÁC một JSON object với cấu trúc sau. QUAN TRỌNG: Chỉ trả về JSON thuần, không bao gồm backticks hay markdown formatting:

{
  "strongPoints": ["điểm mạnh 1", "điểm mạnh 2", "..."],
  "weakPoints": ["điểm yếu 1", "điểm yếu 2", "..."],
  "recommendedSubjects": ["môn học nên tập trung 1", "môn học nên tập trung 2", "..."],
  "skillsToImprove": ["kỹ năng cần cải thiện 1", "kỹ năng cần cải thiện 2", "..."],
  "studyPlan": ["bước 1 trong kế hoạch học", "bước 2 trong kế hoạch học", "..."],
  "careerAdvice": "lời khuyên tổng quát về nghề nghiệp và con đường phát triển"
}

CHI TIẾT:
- strongPoints: Liệt kê 3-5 điểm mạnh của học sinh phù hợp với ngành học này
- weakPoints: Liệt kê 2-3 điểm yếu hoặc thách thức học sinh có thể gặp phải
- recommendedSubjects: 4-6 môn học cụ thể học sinh nên tập trung để thành công trong ngành
- skillsToImprove: 4-6 kỹ năng cụ thể học sinh nên rèn luyện thêm
- studyPlan: 5-7 bước cụ thể trong kế hoạch học tập 3-4 năm tới
- careerAdvice: Đoạn văn 2-3 câu về triển vọng nghề nghiệp và cách phát triển

Hãy trả lời bằng tiếng Việt, cụ thể và thiết thực.
  `;

  return getChatCompletion({
    prompt,
    temperature: 0.3, // Thấp hơn để có kết quả nhất quán
    maxOutputTokens: 2000, // Tăng để có phân tích đầy đủ
  });
}
