import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Result, type Traits, type Scores } from "@/utils/scoring";
import majors from "@/data/majors.json";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import html2canvas from "html2canvas";

interface PersonalInfographicProps {
  result: Result;
}

const PersonalInfographic = ({ result }: PersonalInfographicProps) => {
  const infographicRef = useRef<HTMLDivElement>(null);

  // Chuẩn bị dữ liệu cho radar chart (đặc điểm tính cách)
  const traitLabels = [
    "Tư duy logic",
    "Sáng tạo",
    "Giao tiếp",
    "Lãnh đạo",
    "Tỉ mỉ",
    "Kiên nhẫn",
  ];

  const traitKeys = [
    "logic",
    "creativity",
    "communication",
    "leadership",
    "meticulous",
    "patience",
  ];

  const radarData = traitKeys.map((key, index) => ({
    trait: traitLabels[index],
    value: (result.submission.traits[key as keyof Traits] || 0) * 20, // Chuyển từ thang 1-5 về thang 100
    fullMark: 100,
  }));

  // Chuẩn bị dữ liệu cho bar chart (điểm số môn học)
  const subjectMapping = [
    { key: "math", label: "Toán" },
    { key: "literature", label: "Văn" },
    { key: "english", label: "Anh" },
    { key: "physics", label: "Lý" },
    { key: "chemistry", label: "Hóa" },
    { key: "informatics", label: "Tin học" },
  ];

  const barData = subjectMapping
    .map(({ key, label }) => ({
      subject: label,
      score: result.submission.scores[key as keyof Scores] || 0,
    }))
    .filter((item) => item.score > 0); // Chỉ hiển thị môn có điểm

  // Download infographic as image
  const downloadInfographic = async () => {
    if (!infographicRef.current) return;

    try {
      const canvas = await html2canvas(infographicRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.download = `tu-van-nganh-hoc-${
        result.submission.name || "anonymous"
      }.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Lỗi khi tải infographic:", error);
    }
  };

  // Share infographic
  const shareInfographic = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Tư vấn ngành học cho ${result.submission.name}`,
          text: `Tôi vừa hoàn thành bài test tư vấn ngành học tại FPT Polytechnic! Top 3 ngành phù hợp với tôi là: ${result.top
            .slice(0, 3)
            .map((m) => m.name_vi)
            .join(", ")}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Chia sẻ bị hủy:", error);
      }
    } else {
      // Fallback: copy link to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép link vào clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Nút điều khiển */}
      <div className="flex justify-end gap-3">
        <Button onClick={shareInfographic} variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Chia sẻ
        </Button>
        <Button onClick={downloadInfographic} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Tải về
        </Button>
      </div>

      {/* Infographic */}
      <div
        ref={infographicRef}
        className="bg-white p-8 rounded-lg shadow-lg space-y-8"
        style={{ minHeight: "1000px" }}
      >
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Báo cáo tư vấn ngành học
          </h1>
          <div className="text-xl text-blue-600 font-semibold">
            {result.submission.name || "Sinh viên"}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            FPT Polytechnic - AI Major Advisor
          </div>
          <div className="text-xs text-gray-400">
            Ngày tạo:{" "}
            {new Date(result.submission.createdAt).toLocaleDateString("vi-VN")}
          </div>
        </div>

        {/* Top 3 ngành học được đề xuất */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            🎯 Top 3 ngành học phù hợp
          </h2>
          <div className="grid gap-4">
            {result.top.slice(0, 3).map((major, index) => (
              <div
                key={major.id}
                className={`p-4 rounded-lg border-l-4 ${
                  index === 0
                    ? "border-yellow-400 bg-yellow-50"
                    : index === 1
                    ? "border-gray-400 bg-gray-50"
                    : "border-orange-400 bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl ${
                          index === 0
                            ? "text-yellow-600"
                            : index === 1
                            ? "text-gray-600"
                            : "text-orange-600"
                        }`}
                      >
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {major.name_vi}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {major.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        index === 0
                          ? "text-yellow-600"
                          : index === 1
                          ? "text-gray-600"
                          : "text-orange-600"
                      }`}
                    >
                      {major.score?.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Phù hợp</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Biểu đồ radar - Phân tích tính cách */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-center">
                📊 Phân tích tính cách
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="trait" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis
                    angle={45}
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                  />
                  <Radar
                    name="Điểm"
                    dataKey="value"
                    stroke="#FF6B35"
                    fill="#FF6B35"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="text-xs text-gray-500 text-center mt-2">
                Thang điểm: 0-100 | Cao hơn = Phù hợp hơn
              </div>
            </CardContent>
          </Card>

          {/* Biểu đồ cột - Điểm số học tập */}
          {barData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-center">
                  📚 Kết quả học tập
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value) => [`${value} điểm`, "Điểm số"]}
                    />
                    <Bar dataKey="score" fill="#004E89" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-xs text-gray-500 text-center mt-2">
                  Thang điểm: 0-10 | Điểm số các môn học
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Thông tin bổ sung */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sở thích */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">❤️ Sở thích quan tâm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.submission.preferences.map((pref, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {pref}
                  </span>
                ))}
                {result.submission.customPreference && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {result.submission.customPreference}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Định hướng nghề nghiệp */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                🎯 Định hướng nghề nghiệp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium text-gray-900">
                  {result.submission.orientation}
                </div>
                {result.submission.favorites.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Ngành yêu thích:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.submission.favorites.map((fav, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                        >
                          {fav}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lời khuyên */}
        {result.reasons && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Lời khuyên từ AI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 leading-relaxed">
                {result.reasons}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Được tạo bởi <strong>AI Major Advisor</strong> - FPT Polytechnic
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Hệ thống tư vấn ngành học thông minh •
            https://major-navigator.fpt.edu.vn
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfographic;
