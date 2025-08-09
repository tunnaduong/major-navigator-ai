import hero from "@/assets/hero-fpt.jpg";
import majors from "@/data/majors.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useParams, useSearchParams } from "react-router-dom";
import { QRModal } from "@/components/advisor/QRModal";
import { TraitBarChart } from "@/components/advisor/Charts";
import {
  decodeResultData,
  encodeResultData,
  getResult,
  Result,
} from "@/utils/scoring";
import { useEffect, useMemo, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import * as htmlToImage from "html-to-image";

// Component hiển thị curriculum cho một ngành
function CurriculumDisplay({ major }: { major: any }) {
  if (!major.curriculum) return null;

  const semesters = Object.entries(major.curriculum).map(
    ([key, subjects]: [string, any]) => ({
      name: key,
      subjects: subjects || [],
    })
  );

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-sm mb-3">📚 Chương trình học:</h4>
      <Accordion type="single" collapsible className="w-full">
        {semesters.map((semester, index) => (
          <AccordionItem key={semester.name} value={semester.name}>
            <AccordionTrigger className="text-sm">
              Kỳ {index + 1} ({semester.subjects.length} môn)
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2">
                {semester.subjects.map((subject: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs p-2 bg-muted/50 rounded"
                  >
                    <span className="font-medium">{subject.name}</span>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className="text-xs">
                        {subject.code}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {subject.credits} tín chỉ
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// Component hiển thị skills cho một ngành
function SkillsDisplay({ major }: { major: any }) {
  if (!major.skills) return null;

  return (
    <div className="mt-3">
      <h4 className="font-semibold text-sm mb-2">💡 Kỹ năng cần có:</h4>
      <div className="flex flex-wrap gap-1">
        {major.skills.map((skill: string, index: number) => (
          <Badge key={index} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}

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
            <QRModal url={simpleUrl} />
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
            <Button variant="hero" onClick={downloadPng}>
              Tải infographic
            </Button>
          </div>
        </div>

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
                </div>
                <div className="md:col-span-1">
                  <TraitBarChart traits={result.submission.traits} />
                </div>
              </div>

              {/* Skills và Curriculum cho Top 1 */}
              <div className="border-t pt-4">
                <SkillsDisplay major={top1} />
                <CurriculumDisplay major={top1} />
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
                  <div className="border-t pt-3">
                    <SkillsDisplay major={top2} />
                    <CurriculumDisplay major={top2} />
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
                  <div className="border-t pt-3">
                    <SkillsDisplay major={top3} />
                    <CurriculumDisplay major={top3} />
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
      </div>
    </div>
  );
}
