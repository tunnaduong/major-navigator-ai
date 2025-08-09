import { SEO } from "@/components/SEO";

export default function About() {
  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <SEO
        title="About – AI Major Advisor"
        description="Cách chấm điểm và lưu ý khi sử dụng."
      />
      <h1 className="text-3xl font-bold mb-4">Cách chấm điểm</h1>
      <p className="text-muted-foreground mb-6">
        Hệ thống tính điểm dựa trên 3 thành phần: (1) Khớp trait với ngành
        (60%), (2) Điểm môn liên quan (34%), (3) Khớp định hướng (6%). Kết quả
        là gợi ý tham khảo.
      </p>
      <h2 className="text-xl font-semibold mb-2">
        Tuyên bố từ chối trách nhiệm
      </h2>
      <p className="text-muted-foreground">
        Đây là nguyên mẫu (prototype) cho mục đích demo nhanh. Không thay thế tư
        vấn chuyên sâu. Dữ liệu chia sẻ bằng QR chứa nội dung kết quả ở dạng mã
        hoá trong URL.
      </p>
    </div>
  );
}
