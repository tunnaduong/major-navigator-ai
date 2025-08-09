import hero from "@/assets/hero-fpt.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import MajorStatsCharts from "@/components/charts/MajorStatsCharts";

const Index = () => {
  return (
    <div className="">
      <SEO
        title="AI Major Advisor – FPT Polytechnic"
        description="Nhập sở thích, kỹ năng, điểm số để nhận 3 ngành phù hợp nhất. Chia sẻ bằng QR ngay!"
      />
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="FPT-inspired gradient hero"
          className="absolute inset-0 h-[420px] w-full object-cover"
        />
        <div className="relative z-10 container mx-auto flex min-h-[420px] flex-col items-center justify-center text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight dark:text-black">
            AI Major Advisor
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tư vấn chọn ngành thông minh cho sinh viên FPT Polytechnic. — Smart
            AI guidance for your future major.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/quiz">
              <Button variant="hero" size="lg">
                Bắt đầu tư vấn
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="soft" size="lg">
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-soft">
              <CardContent className="p-6">
                <div className="text-2xl mb-2">{i}</div>
                {i === 1 && (
                  <p>Nhập thông tin: sở thích, kỹ năng, điểm số, định hướng.</p>
                )}
                {i === 2 && (
                  <p>Hệ thống chấm điểm thông minh dựa trên trait & môn học.</p>
                )}
                {i === 3 && (
                  <p>Nhận Top 3 ngành phù hợp + biểu đồ + chia sẻ QR.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center text-sm text-muted-foreground">
          FPT Polytechnic
        </div>
      </section>

      {/* Section thống kê ngành học */}
      <section className="container mx-auto py-12 bg-gray-50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Thống kê ngành học được quan tâm
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá xu hướng lựa chọn ngành học của sinh viên FPT Polytechnic.
            Dữ liệu được cập nhật thường xuyên từ các lượt tư vấn thực tế.
          </p>
        </div>
        <MajorStatsCharts />
      </section>
    </div>
  );
};

export default Index;
