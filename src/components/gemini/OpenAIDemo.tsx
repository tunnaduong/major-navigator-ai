import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  testGeminiConnection,
  getChatCompletion,
  getMajorRecommendation,
  isGeminiConfigured,
} from "@/integrations/gemini";

export default function GeminiDemo() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");

  // Kiểm tra kết nối Gemini
  const handleTestConnection = async () => {
    setIsLoading(true);
    const result = await testGeminiConnection();
    setIsConnected(result);
    setIsLoading(false);
  };

  // Gọi Chat Completion với input của user
  const handleChatCompletion = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setResponse("");

    const prompt = `Bạn là một trợ lý AI hữu ích. Hãy trả lời bằng tiếng Việt câu hỏi sau: ${userInput}`;

    const result = await getChatCompletion({ prompt });

    if (result.success) {
      setResponse(result.data);
    } else {
      setResponse(`Lỗi: ${result.error}`);
    }

    setIsLoading(false);
  };

  // Demo tư vấn ngành học
  const handleMajorRecommendation = async () => {
    setIsLoading(true);
    setResponse("");

    const sampleProfile = {
      interests: ["công nghệ", "toán học", "giải quyết vấn đề"],
      skills: ["lập trình", "tư duy logic", "phân tích dữ liệu"],
      personality: ["tỉ mỉ", "kiên nhẫn", "thích thử thách"],
      academicPreferences: ["thực hành", "dự án nhóm", "môi trường công nghệ"],
    };

    const result = await getMajorRecommendation(sampleProfile);

    if (result.success) {
      setResponse(result.data);
    } else {
      setResponse(`Lỗi: ${result.error}`);
    }

    setIsLoading(false);
  };

  if (!isGeminiConfigured()) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Gemini AI Demo</CardTitle>
          <CardDescription>Demo tích hợp Google Gemini AI</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              ⚠️ Gemini API key chưa được cấu hình. Vui lòng thêm
              VITE_GEMINI_API_KEY vào file .env
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gemini AI Demo</CardTitle>
        <CardDescription>
          Demo tích hợp Google Gemini AI với các tính năng
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Connection */}
        <div className="space-y-2">
          <Button
            onClick={handleTestConnection}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? "Đang kiểm tra..." : "Kiểm tra kết nối"}
          </Button>

          {isConnected !== null && (
            <Alert>
              <AlertDescription>
                {isConnected
                  ? "✅ Kết nối Gemini thành công!"
                  : "❌ Không thể kết nối với Gemini. Kiểm tra API key."}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Chat Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Nhập câu hỏi của bạn:</label>
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ví dụ: Hãy giải thích về trí tuệ nhân tạo"
            disabled={isLoading}
          />
          <Button
            onClick={handleChatCompletion}
            disabled={isLoading || !userInput.trim()}
          >
            {isLoading ? "Đang xử lý..." : "Gửi câu hỏi"}
          </Button>
        </div>

        {/* Major Recommendation Demo */}
        <div className="space-y-2">
          <Button
            onClick={handleMajorRecommendation}
            disabled={isLoading}
            variant="secondary"
          >
            {isLoading ? "Đang phân tích..." : "Demo tư vấn ngành học"}
          </Button>
        </div>

        {/* Response Display */}
        {response && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Phản hồi từ Gemini:</label>
            <Textarea
              value={response}
              readOnly
              className="min-h-[200px]"
              placeholder="Phản hồi sẽ xuất hiện ở đây..."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
