# Hướng dẫn tích hợp Google Gemini AI

## Cài đặt ban đầu

### 1. Cấu hình API Key

Thêm Gemini API key vào file `.env`:

```bash
VITE_GEMINI_API_KEY=your-actual-gemini-api-key-here
```

⚠️ **Lưu ý bảo mật**:

- Không commit API key lên Git
- File `.env` đã được thêm vào `.gitignore`
- Sử dụng `.env.example` làm template

### 2. Lấy API Key từ Google AI Studio

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập bằng tài khoản Google
3. Tạo API key mới
4. Copy và dán vào file `.env`

## Cách sử dụng

### Import các service Gemini

```typescript
import {
  getChatCompletion,
  getMajorRecommendation,
  testGeminiConnection,
  isGeminiConfigured,
} from "@/integrations/gemini";
```

### 1. Kiểm tra kết nối

```typescript
const isConnected = await testGeminiConnection();
if (isConnected) {
  console.log("Gemini AI hoạt động bình thường");
}
```

### 2. Chat Completion cơ bản

```typescript
const result = await getChatCompletion({
  prompt: "Bạn là một trợ lý AI hữu ích. Hãy trả lời: Xin chào!",
  temperature: 0.7,
  maxOutputTokens: 1000,
});

if (result.success) {
  console.log("Phản hồi:", result.data);
} else {
  console.error("Lỗi:", result.error);
}
```

### 3. Tư vấn ngành học (chuyên biệt cho ứng dụng)

```typescript
const userProfile = {
  interests: ["công nghệ", "toán học"],
  skills: ["lập trình", "phân tích"],
  personality: ["tỉ mỉ", "kiên nhẫn"],
  academicPreferences: ["thực hành", "dự án"],
};

const recommendation = await getMajorRecommendation(userProfile);
if (recommendation.success) {
  console.log("Gợi ý ngành học:", recommendation.data);
}
```

### 4. Phân tích văn bản tùy chỉnh

```typescript
import { analyzeText } from "@/integrations/gemini";

const analysis = await analyzeText(
  "Văn bản cần phân tích",
  "Hãy phân tích cảm xúc của văn bản này"
);
```

## Cấu trúc file

```
src/integrations/gemini/
├── client.ts          # Gemini client và test connection
├── services.ts        # Các service API (chat, text generation, etc.)
└── index.ts          # Export tất cả functions

src/components/gemini/
├── GeminiDemo.tsx    # Component demo sử dụng API
└── GeminiDebug.tsx   # Component debug thông tin API key
```

## Các tính năng có sẵn

### 1. Text Generation

- Tương tác với Gemini Pro models
- Hỗ trợ temperature và max output tokens
- Tạo nội dung văn bản thông minh

### 2. Text Summarization

- Tạo summary văn bản (thay thế cho embeddings)
- Sử dụng Gemini để tóm tắt nội dung

### 3. Text Analysis

- Phân tích văn bản với prompt tùy chỉnh
- Suitable cho sentiment analysis, classification, etc.

### 4. Major Recommendation

- Service chuyên biệt cho tư vấn ngành học
- Phân tích profile học sinh
- Đưa ra gợi ý ngành học phù hợp

## Xử lý lỗi

Tất cả các service đều trả về object với format:

```typescript
// Thành công
{
  success: true,
  data: string,
  usage?: {
    promptTokens: number,
    completionTokens: number,
    totalTokens: number
  }
}

// Lỗi
{
  success: false,
  error: string
}
```

## Component Demo

Sử dụng `GeminiDemo` component để test các tính năng:

```typescript
import GeminiDemo from "@/components/gemini/GeminiDemo";

// Trong component của bạn
<GeminiDemo />;
```

## So sánh với OpenAI

| Tính năng           | OpenAI                 | Gemini                      |
| ------------------- | ---------------------- | --------------------------- |
| **Text Generation** | GPT-3.5/4              | Gemini 1.5 Flash           |
| **API Format**      | Chat Completion        | Generate Content            |
| **Pricing**         | Token-based            | Token-based (miễn phí tier) |
| **Embeddings**      | text-embedding-ada-002 | Text Summarization          |
| **Context Window**  | 4K-32K tokens          | 32K tokens                  |
| **Languages**       | Excellent Vietnamese   | Good Vietnamese             |

## Best Practices

### 1. Bảo mật

- Luôn kiểm tra `isGeminiConfigured()` trước khi sử dụng
- Không log API responses chứa thông tin nhạy cảm
- Sử dụng environment variables

### 2. Performance

- Implement loading states
- Cache responses khi có thể
- Sử dụng appropriate temperature values:
  - 0.1-0.3: Factual, deterministic responses
  - 0.7-0.9: Creative, varied responses

### 3. Error Handling

- Luôn check `result.success` trước khi sử dụng data
- Implement fallback UI khi API fail
- Show meaningful error messages cho user

### 4. Cost Optimization

- Sử dụng gemini-pro cho most cases
- Limit maxOutputTokens appropriately
- Cache frequent requests
- Gemini có free tier với giới hạn requests

## Troubleshooting

### Lỗi thường gặp:

1. **"API key không được cấu hình"**

   - Check file `.env` có tồn tại không
   - Verify API key format từ Google AI Studio

2. **"403 Forbidden" errors**

   - API key có thể không hợp lệ hoặc hết hạn
   - Check quota limits trong Google AI Studio

3. **"Rate limit exceeded"**

   - Gemini có giới hạn requests per minute
   - Implement retry logic hoặc request queuing

4. **Network errors**
   - Check internet connection
   - Verify Google AI service status

## Ví dụ Integration với Result page

```typescript
// Trong src/pages/Result.tsx
import { getMajorRecommendation } from "@/integrations/gemini";

const handleGetAIRecommendation = async () => {
  const userProfile = {
    interests: selectedAnswers.interests,
    skills: selectedAnswers.skills,
    personality: personalityTraits,
    academicPreferences: academicPrefs,
  };

  const recommendation = await getMajorRecommendation(userProfile);
  if (recommendation.success) {
    setAIRecommendation(recommendation.data);
  }
};
```

## Ưu điểm của Gemini so với OpenAI

### ✅ Ưu điểm:

- **Miễn phí**: Free tier với giới hạn cao hơn OpenAI
- **Tốc độ**: Response time nhanh
- **Đa ngôn ngữ**: Hỗ trợ tốt tiếng Việt
- **Dễ sử dụng**: API đơn giản, không phức tạp như OpenAI
- **Privacy**: Google AI với tiêu chuẩn bảo mật cao

### ⚠️ Hạn chế:

- **Ecosystem**: Ít tools và libraries hơn OpenAI
- **Community**: Cộng đồng nhỏ hơn
- **Advanced features**: Chưa có embeddings API riêng
- **Model variety**: Ít model options hơn OpenAI
