import hero from "@/assets/hero-fpt.jpg";
import majors from "@/data/majors.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useSearchParams } from "react-router-dom";
import { QRModal } from "@/components/advisor/QRModal";
import { TraitBarChart } from "@/components/advisor/Charts";
import { decodeResultData, encodeResultData, getSubmission, Result } from "@/utils/scoring";
import { useEffect, useMemo, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import * as htmlToImage from "html-to-image";

export default function ResultPage(){
  const { id } = useParams();
  const [params] = useSearchParams();
  const [result, setResult] = useState<Result | null>(null);
  const top1 = useMemo(()=> result ? majors.find(m=> m.id === result.top[0].majorId) : null, [result]);

  useEffect(()=>{
    const dataParam = params.get("data");
    if(dataParam){
      const r = decodeResultData(dataParam);
      if(r) return setResult(r);
    }
    if(id){ setResult(getSubmission(id)); }
  }, [id, params]);

  const shareUrl = useMemo(()=> {
    if(!result) return window.location.href;
    const url = `${window.location.origin}/result/${result.id}?data=${encodeResultData(result)}`;
    return url;
  }, [result]);

  const printPdf = () => window.print();

  const ref = useRef<HTMLDivElement>(null);
  const downloadPng = async () => {
    if(!ref.current) return;
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
    const dataUrl = await htmlToImage.toPng(ref.current, { pixelRatio: 2, cacheBust: true, backgroundColor: `hsl(${bg})` });
    const link = document.createElement('a');
    link.download = `ai-major-advisor-${id}.png`;
    link.href = dataUrl;
    link.click();
  };

  if(!result || !top1){
    return <div className="container mx-auto py-16 text-center text-muted-foreground">Không tìm thấy kết quả. Vui lòng quay lại trang Quiz.</div>;
  }

  const top2 = majors.find(m=> m.id === result.top[1]?.majorId);
  const top3 = majors.find(m=> m.id === result.top[2]?.majorId);

  return (
    <div className="">
      <SEO title="Kết quả tư vấn – AI Major Advisor" description="Top 3 ngành phù hợp của bạn tại FPT Polytechnic." />
      <section className="relative">
        <img src={hero} alt="Hero background with FPT-inspired gradient" className="h-48 w-full object-cover" loading="lazy" />
      </section>

      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Top ngành phù hợp nhất của bạn</h1>
            <p className="text-muted-foreground">Share, in PDF, download infographic</p>
          </div>
          <div className="flex gap-2">
            <QRModal url={shareUrl} />
            <Button variant="outline" onClick={()=> { navigator.clipboard.writeText(shareUrl); }}>Sao chép link</Button>
            <Button variant="soft" onClick={printPdf}>In PDF</Button>
            <Button variant="hero" onClick={downloadPng}>Tải infographic</Button>
          </div>
        </div>

        <div ref={ref} className="space-y-6">
          <Card className="shadow-elevate">
            <CardHeader>
              <CardTitle>Top 1 — {top1.name_vi} ({top1.name_en})</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <p className="text-sm">{top1.description}</p>
                <p className="text-sm"><strong>Vì sao phù hợp:</strong> {result.reasons}</p>
              </div>
              <div className="md:col-span-1">
                <TraitBarChart traits={result.submission.traits} />
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {top2 && (
              <Card>
                <CardHeader><CardTitle>Top 2 — {top2.name_vi}</CardTitle></CardHeader>
                <CardContent className="text-sm">{top2.description}</CardContent>
              </Card>
            )}
            {top3 && (
              <Card>
                <CardHeader><CardTitle>Top 3 — {top3.name_vi}</CardTitle></CardHeader>
                <CardContent className="text-sm">{top3.description}</CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
