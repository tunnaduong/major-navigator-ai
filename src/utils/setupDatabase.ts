import { supabase } from "@/integrations/supabase/client";

// Function để tạo table quiz_results (nếu chưa có)
export async function setupDatabase() {
  try {
    // Thử query để kiểm tra table đã tồn tại chưa
    const { error: checkError } = await supabase
      .from("quiz_results")
      .select("id")
      .limit(1);

    if (checkError) {
      console.log(
        "Table quiz_results chưa tồn tại, cần tạo trong Supabase dashboard"
      );
      console.log("Vui lòng chạy migration SQL sau trong Supabase dashboard:");
      console.log(`
-- Tạo table quiz_results để lưu kết quả quiz
CREATE TABLE quiz_results (
    id TEXT PRIMARY KEY,
    submission_data JSONB NOT NULL,
    scores JSONB NOT NULL,
    top_majors JSONB NOT NULL,
    reasons TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để tăng tốc query
CREATE INDEX idx_quiz_results_created_at ON quiz_results(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép public read
CREATE POLICY "Allow public read" ON quiz_results
    FOR SELECT USING (true);

-- Tạo policy cho phép public insert
CREATE POLICY "Allow public insert" ON quiz_results
    FOR INSERT WITH CHECK (true);
      `);
      return false;
    }

    console.log("✅ Table quiz_results đã tồn tại và sẵn sàng sử dụng");
    return true;
  } catch (error) {
    console.error("Lỗi khi kiểm tra database:", error);
    return false;
  }
}

// Function test connection
export async function testSupabaseConnection() {
  try {
    console.log("🔍 Đang test kết nối Supabase...");
    console.log("📋 URL:", supabase.supabaseUrl);
    console.log("🔑 API Key:", supabase.supabaseKey.substring(0, 20) + "...");

    // Test 1: Kiểm tra basic connection với một table chắc chắn tồn tại
    const { data: healthCheck, error: healthError } = await supabase
      .from("quiz_results")
      .select("*")
      .limit(1);

    if (healthError) {
      console.error("❌ Lỗi kết nối cơ bản:", healthError);
      console.log("Chi tiết lỗi:", {
        message: healthError.message,
        code: healthError.code,
        details: healthError.details,
        hint: healthError.hint,
      });
      return false;
    }

    console.log("✅ Kết nối Supabase thành công!");
    console.log("📊 Dữ liệu test:", healthCheck);
    return true;
  } catch (error) {
    console.error("❌ Lỗi kết nối Supabase:", error);
    return false;
  }
}

// Function test thực tế với insert/select
export async function testSupabaseOperations() {
  try {
    console.log("🧪 Đang test các operations Supabase...");

    const testId = `test_${Date.now()}`;
    const testData = {
      id: testId,
      submission_data: { name: "Test User", test: true },
      scores: { math: 8, english: 7 },
      top_majors: [{ majorId: "software", score: 0.85 }],
      reasons: "Test connection",
    };

    // Test INSERT
    console.log("📝 Test INSERT...");
    const { error: insertError } = await supabase
      .from("quiz_results")
      .insert(testData);

    if (insertError) {
      console.error("❌ Lỗi INSERT:", insertError);
      return false;
    }
    console.log("✅ INSERT thành công");

    // Test SELECT
    console.log("📖 Test SELECT...");
    const { data: selectData, error: selectError } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("id", testId)
      .single();

    if (selectError) {
      console.error("❌ Lỗi SELECT:", selectError);
      return false;
    }
    console.log("✅ SELECT thành công:", selectData);

    // Clean up: DELETE test data
    console.log("🗑️ Cleanup test data...");
    const { error: deleteError } = await supabase
      .from("quiz_results")
      .delete()
      .eq("id", testId);

    if (deleteError) {
      console.warn("⚠️ Không thể xóa test data:", deleteError);
    } else {
      console.log("✅ Cleanup thành công");
    }

    console.log("🎉 Tất cả operations hoạt động bình thường!");
    return true;
  } catch (error) {
    console.error("❌ Lỗi test operations:", error);
    return false;
  }
}
