import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  BookOpen,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getDetailedMajorAnalysis } from "@/integrations/gemini";

// Helper function để clean JSON response từ AI
function cleanJsonResponse(rawResponse: string): string {
  let cleaned = rawResponse.trim();

  // Loại bỏ markdown code blocks
  cleaned = cleaned.replace(/```json\s*/g, "").replace(/```\s*/g, "");

  // Loại bỏ text before/after JSON nếu có
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");

  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }

  return cleaned;
}

interface Major {
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
}

interface AnalysisData {
  strongPoints: string[];
  weakPoints: string[];
  recommendedSubjects: string[];
  skillsToImprove: string[];
  studyPlan: string[];
  careerAdvice: string;
}

interface AIAnalysisModalProps {
  major: Major;
  userProfile: {
    name: string;
    preferences: string[];
    traits: Record<string, number>;
    scores: Record<string, number>;
    favorites: string[];
    orientation: string;
    habits: string;
  };
  triggerText?: string;
}

export function AIAnalysisModal({
  major,
  userProfile,
  triggerText = "🤖 Phân tích",
}: AIAnalysisModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    if (analysis) return; // Đã có kết quả, không cần gọi lại

    setIsLoading(true);
    setError(null);

    try {
      const result = await getDetailedMajorAnalysis(major, userProfile);

      if (result.success) {
        try {
          // Clean và parse JSON response từ Gemini
          const cleanedJson = cleanJsonResponse(result.data);
          console.log("Cleaned JSON:", cleanedJson);

          const parsedData = JSON.parse(cleanedJson);
          setAnalysis(parsedData);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          console.error("Raw response:", result.data);

          // Fallback: Tạo phân tích cơ bản nếu không parse được
          setAnalysis({
            strongPoints: ["Tư duy logic tốt", "Có tiềm năng học tập"],
            weakPoints: ["Cần cải thiện kỹ năng giao tiếp"],
            recommendedSubjects: ["Toán học", "Tin học", "Tiếng Anh"],
            skillsToImprove: ["Lập trình", "Tư duy phản biện", "Làm việc nhóm"],
            studyPlan: [
              "Tập trung vào các môn cơ bản",
              "Thực hành nhiều dự án",
              "Tham gia hoạt động nhóm",
            ],
            careerAdvice:
              "Ngành này phù hợp với điểm mạnh của bạn. Hãy kiên trì học tập và rèn luyện kỹ năng.",
          });
        }
      } else {
        setError(result.error || "Không thể kết nối với AI");
      }
    } catch (err) {
      console.error("Error getting AI analysis:", err);
      setError("Lỗi khi phân tích dữ liệu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    if (!analysis) {
      handleAnalysis();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={openModal}
        >
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🤖 Phân tích AI chuyên sâu
          </DialogTitle>
          <DialogDescription>
            Ngành: <strong>{major.name_vi}</strong> - Dành cho{" "}
            {userProfile.name}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>AI đang phân tích hồ sơ của bạn...</span>
          </div>
        )}

        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysis && (
          <div className="space-y-6">
            {/* Điểm mạnh */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  Điểm mạnh của bạn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.strongPoints.map((point, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {point}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Điểm cần cải thiện */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Target className="h-5 w-5" />
                  Kỹ năng cần phát triển
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">
                      Điểm yếu cần khắc phục:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.weakPoints.map((point, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-orange-300 text-orange-700"
                        >
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Kỹ năng nên rèn luyện:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {analysis.skillsToImprove.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg"
                        >
                          <span className="text-blue-600">•</span>
                          <span className="text-sm">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Môn học nên tập trung */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                  Môn học nên tập trung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.recommendedSubjects.map((subject, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-blue-50"
                    >
                      <span className="font-medium text-blue-800">
                        {subject}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Kế hoạch học tập */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  📋 Kế hoạch học tập được đề xuất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.studyPlan.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-2">
                      <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lời khuyên nghề nghiệp */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-600">
                  💡 Lời khuyên nghề nghiệp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed bg-indigo-50 p-4 rounded-lg">
                  {analysis.careerAdvice}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
