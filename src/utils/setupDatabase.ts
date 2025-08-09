import { supabase } from "@/integrations/supabase/client";

// Function để tạo table quiz_results (nếu chưa có)
export async function setupDatabase() {
  try {
    // Thử query để kiểm tra table đã tồn tại chưa
    const { error: checkError } = await supabase
      .from('quiz_results')
      .select('id')
      .limit(1);

    if (checkError) {
      console.log('Table quiz_results chưa tồn tại, cần tạo trong Supabase dashboard');
      console.log('Vui lòng chạy migration SQL sau trong Supabase dashboard:');
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

    console.log('✅ Table quiz_results đã tồn tại và sẵn sàng sử dụng');
    return true;
  } catch (error) {
    console.error('Lỗi khi kiểm tra database:', error);
    return false;
  }
}

// Function test connection
export async function testSupabaseConnection() {
  try {
    console.log('🔍 Đang test kết nối Supabase...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('quiz_results')
      .select('count')
      .limit(0);

    if (error) {
      console.error('❌ Lỗi kết nối:', error.message);
      return false;
    }

    console.log('✅ Kết nối Supabase thành công!');
    return true;
  } catch (error) {
    console.error('❌ Lỗi kết nối Supabase:', error);
    return false;
  }
}