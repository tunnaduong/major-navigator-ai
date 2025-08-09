import hero from "@/assets/hero-fpt.jpg";
import majors from "@/data/majors.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useParams, useSearchParams } from "react-router-dom";
import { QRModal } from "@/components/advisor/QRModal";
import { TraitBarChart } from "@/components/advisor/Charts";
import { SubjectModal } from "@/components/advisor/SubjectModal";
import { AIAnalysisModal } from "@/components/advisor/AIAnalysisModal";
import PersonalInfographic from "@/components/infographic/PersonalInfographic";
import {
  decodeResultData,
  encodeResultData,
  getResult,
  Result,
} from "@/utils/scoring";
import { useEffect, useMemo, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import * as htmlToImage from "html-to-image";

export default function ResultPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const [result, setResult] = useState<Result | null>(null);
  const top1 = useMemo(
    () => (result ? majors.find((m) => m.id === result.top[0].majorId) : null),
    [result]
  );

  useEffect(() => {
    const loadResult = async () => {
      const dataParam = params.get("data");
      if (dataParam) {
        const r = decodeResultData(dataParam);
        if (r) return setResult(r);
      }
      if (id) {
        const result = await getResult(id);
        setResult(result);
      }
    };

    loadResult();
  }, [id, params]);

  // URL đơn giản cho QR code (dễ quét hơn)
  const simpleUrl = useMemo(() => {
    if (!result) return window.location.href;
    return `${window.location.origin}/result/${result.id}`;
  }, [result]);

  // URL đầy đủ có data cho chia sẻ (hoạt động mà không cần localStorage)
  const shareUrl = useMemo(() => {
    if (!result) return window.location.href;
    const url = `${window.location.origin}/result/${
      result.id
    }?data=${encodeResultData(result)}`;
    return url;
  }, [result]);

  const printPdf = () => window.print();

  const ref = useRef<HTMLDivElement>(null);
  const downloadPng = async () => {
    if (!ref.current) return;

    try {
      // Đảm bảo tất cả image đã load
      const images = ref.current.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
        })
      );

      // Cấu hình xuất với background trắng và kích thước đầy đủ
      const dataUrl = await htmlToImage.toPng(ref.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
        width: ref.current.scrollWidth,
        height: ref.current.scrollHeight,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
        filter: (node) => {
          // Loại bỏ các element có thể gây vấn đề
          if (node.tagName?.toLowerCase() === "script") return false;
          return true;
        },
      });

      const link = document.createElement("a");
      link.download = `ai-major-advisor-${id}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Lỗi khi tạo ảnh:", error);
      alert("Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại.");
    }
  };

  if (!result || !top1) {
    return (
      <div className="container mx-auto py-16 text-center text-muted-foreground">
        Không tìm thấy kết quả. Vui lòng quay lại trang Quiz.
      </div>
    );
  }

  const top2 = majors.find((m) => m.id === result.top[1]?.majorId);
  const top3 = majors.find((m) => m.id === result.top[2]?.majorId);

  return (
    <div className="">
      <SEO
        title="Kết quả tư vấn – AI Major Advisor"
        description="Top 3 ngành phù hợp của bạn tại FPT Polytechnic."
      />

      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Top ngành phù hợp nhất của bạn
            </h1>
            <p className="text-muted-foreground">
              Share, in PDF, download infographic
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert("Đã sao chép link đầy đủ (hoạt động trên mọi thiết bị)!");
              }}
            >
              Sao chép link đầy đủ
            </Button>
            <Button variant="soft" onClick={printPdf}>
              In PDF
            </Button>
            <QRModal url={simpleUrl} />
          </div>
        </div>

        {/* Tabs để tổ chức nội dung */}
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">📊 Kết quả</TabsTrigger>
            <TabsTrigger value="analysis">📈 Phân tích chi tiết</TabsTrigger>
            <TabsTrigger value="infographic">🎨 Infographic</TabsTrigger>
          </TabsList>

          <TabsContent value="results">
            {/* Phần này sẽ được xuất ra infographic */}
            <div ref={ref} className="space-y-6 bg-white p-6 rounded-lg">
              {/* Header cho infographic */}
              <div className="text-center border-b pb-4">
                <h2 className="text-3xl font-bold text-primary">
                  AI Major Advisor
                </h2>
                <p className="text-lg text-muted-foreground">
                  Kết quả tư vấn chọn ngành - FPT Polytechnic
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Dành cho: {result.submission.name}
                </p>
              </div>
              <Card className="shadow-elevate">
                <CardHeader>
                  <CardTitle>
                    Top 1 — {top1.name_vi} ({top1.name_en})
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-sm">{top1.description}</p>
                      <p className="text-sm">
                        <strong>Vì sao phù hợp:</strong> {result.reasons}
                      </p>

                      {/* Các nút hành động cho Top 1 */}
                      <div className="flex gap-2 pt-2">
                        <AIAnalysisModal
                          major={top1}
                          userProfile={{
                            name: result.submission.name,
                            preferences: result.submission.preferences,
                            traits: result.submission.traits,
                            scores: result.submission.scores,
                            favorites: result.submission.favorites,
                            orientation: result.submission.orientation,
                            habits: result.submission.habits,
                          }}
                          triggerText="🤖 Phân tích"
                        />
                        <SubjectModal
                          major={top1}
                          triggerText="📚 Xem môn học"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      <TraitBarChart traits={result.submission.traits} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {top2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Top 2 — {top2.name_vi}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">{top2.description}</p>

                      {/* Các nút hành động */}
                      <div className="flex gap-2 pt-2">
                        <AIAnalysisModal
                          major={top2}
                          userProfile={{
                            name: result.submission.name,
                            preferences: result.submission.preferences,
                            traits: result.submission.traits,
                            scores: result.submission.scores,
                            favorites: result.submission.favorites,
                            orientation: result.submission.orientation,
                            habits: result.submission.habits,
                          }}
                          triggerText="🤖 Phân tích"
                        />
                        <SubjectModal
                          major={top2}
                          triggerText="📚 Xem môn học"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
                {top3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Top 3 — {top3.name_vi}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">{top3.description}</p>

                      {/* Các nút hành động */}
                      <div className="flex gap-2 pt-2">
                        <AIAnalysisModal
                          major={top3}
                          userProfile={{
                            name: result.submission.name,
                            preferences: result.submission.preferences,
                            traits: result.submission.traits,
                            scores: result.submission.scores,
                            favorites: result.submission.favorites,
                            orientation: result.submission.orientation,
                            habits: result.submission.habits,
                          }}
                          triggerText="🤖 Phân tích"
                        />
                        <SubjectModal
                          major={top3}
                          triggerText="📚 Xem môn học"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Footer cho infographic */}
              <div className="text-center border-t pt-4 mt-6">
                <p className="text-sm text-muted-foreground">
                  🎓 Được tạo bởi AI Major Advisor - FPT Polytechnic
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date().toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>📊 Phân tích tính cách chi tiết</CardTitle>
                </CardHeader>
                <CardContent>
                  <TraitBarChart traits={result.submission.traits} />
                  <div className="mt-4 grid gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Sở thích của bạn:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.submission.preferences.map((pref, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {pref}
                          </span>
                        ))}
                        {result.submission.customPreference &&
                          result.submission.customPreference
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item.length > 0)
                            .map((item, index) => (
                              <span
                                key={`custom-${index}`}
                                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                              >
                                {item}
                              </span>
                            ))}
                      </div>
                    </div>
                    {result.submission.favorites.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Ngành yêu thích:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.submission.favorites.map((fav, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                            >
                              {fav}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-2">
                        Định hướng nghề nghiệp:
                      </h4>
                      <p className="text-gray-700">
                        {result.submission.orientation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🏆 Chi tiết top 3 ngành phù hợp</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.top.slice(0, 3).map((major, index) => {
                      const majorData = majors.find(
                        (m) => m.id === major.majorId
                      );
                      if (!majorData) return null;

                      return (
                        <div
                          key={major.majorId}
                          className="border-l-4 border-blue-500 pl-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-semibold text-lg">
                                #{index + 1} {majorData.name_vi}
                              </h5>
                              <p className="text-gray-600 text-sm mb-2">
                                {majorData.description}
                              </p>
                              <div className="flex gap-2">
                                <AIAnalysisModal
                                  major={majorData}
                                  userProfile={{
                                    name: result.submission.name,
                                    preferences: result.submission.preferences,
                                    traits: result.submission.traits,
                                    scores: result.submission.scores,
                                    favorites: result.submission.favorites,
                                    orientation: result.submission.orientation,
                                    habits: result.submission.habits,
                                  }}
                                  triggerText="🤖 Phân tích AI"
                                />
                                <SubjectModal
                                  major={majorData}
                                  triggerText="📚 Xem môn học"
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                {((major.score || 0) * 100).toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500">
                                Độ phù hợp
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="infographic">
            <PersonalInfographic result={result} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
