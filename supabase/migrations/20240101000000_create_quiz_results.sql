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

-- Tạo policy cho phép public read (vì không cần auth cho demo)
CREATE POLICY "Allow public read" ON quiz_results
    FOR SELECT USING (true);

-- Tạo policy cho phép public insert (vì không cần auth cho demo)
CREATE POLICY "Allow public insert" ON quiz_results
    FOR INSERT WITH CHECK (true);

-- Function để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger để tự động update updated_at
CREATE TRIGGER update_quiz_results_updated_at
    BEFORE UPDATE ON quiz_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();