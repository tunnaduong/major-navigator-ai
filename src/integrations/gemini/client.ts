import { GoogleGenerativeAI } from "@google/generative-ai";

// Lấy API key từ environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn(
    "Gemini API key không được tìm thấy. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env"
  );
}

// Tạo client Gemini
export const gemini = new GoogleGenerativeAI(GEMINI_API_KEY || "");

// Kiểm tra kết nối Gemini
export async function testGeminiConnection(): Promise<boolean> {
  try {
    console.log("🔍 Debug - API Key info:", {
      exists: !!GEMINI_API_KEY,
      length: GEMINI_API_KEY?.length || 0,
      starts: GEMINI_API_KEY?.substring(0, 10) || "N/A",
      env: import.meta.env.MODE,
    });

    if (!GEMINI_API_KEY) {
      throw new Error("API key không được cấu hình");
    }

    // Thử gọi API đơn giản để kiểm tra kết nối
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    const text = response.text();

    console.log(
      "✅ Kết nối Gemini thành công, response:",
      text.substring(0, 50) + "..."
    );
    return true;
  } catch (error) {
    console.error("❌ Lỗi kết nối Gemini:", error);
    if (error instanceof Error) {
      console.error("Chi tiết lỗi:", error.message);
    }
    return false;
  }
}
