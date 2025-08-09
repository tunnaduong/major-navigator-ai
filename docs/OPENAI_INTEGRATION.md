# Hướng dẫn tích hợp Google Gemini AI

## Cài đặt ban đầu

### 1. Cấu hình API Key

Thêm OpenAI API key vào file `.env`:

```bash
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

⚠️ **Lưu ý bảo mật**:

- Không commit API key lên Git
- File `.env` đã được thêm vào `.gitignore`
- Sử dụng `.env.example` làm template

### 2. Lấy API Key từ OpenAI

1. Truy cập [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Đăng nhập hoặc tạo tài khoản
3. Tạo API key mới
4. Copy và dán vào file `.env`

## Cách sử dụng

### Import các service OpenAI

```typescript
import {
  getChatCompletion,
  getMajorRecommendation,
  testOpenAIConnection,
  isOpenAIConfigured,
} from "@/integrations/openai";
```

### 1. Kiểm tra kết nối

```typescript
const isConnected = await testOpenAIConnection();
if (isConnected) {
  console.log("OpenAI API hoạt động bình thường");
}
```

### 2. Chat Completion cơ bản

```typescript
const result = await getChatCompletion({
  messages: [
    {
      role: "system",
      content: "Bạn là một trợ lý AI hữu ích",
    },
    {
      role: "user",
      content: "Xin chào!",
    },
  ],
  temperature: 0.7,
  maxTokens: 1000,
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
import { analyzeText } from "@/integrations/openai";

const analysis = await analyzeText(
  "Văn bản cần phân tích",
  "Hãy phân tích cảm xúc của văn bản này"
);
```

## Cấu trúc file

```
src/integrations/openai/
├── client.ts          # OpenAI client và test connection
├── services.ts        # Các service API (chat, embeddings, etc.)
└── index.ts          # Export tất cả functions

src/components/openai/
└── OpenAIDemo.tsx    # Component demo sử dụng API
```

## Các tính năng có sẵn

### 1. Chat Completion

- Tương tác với GPT models
- Hỗ trợ system prompts
- Customizable temperature và max tokens

### 2. Embeddings

- Tạo vector embeddings từ text
- Sử dụng model text-embedding-ada-002

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
  usage?: OpenAI.CompletionUsage
}

// Lỗi
{
  success: false,
  error: string
}
```

## Component Demo

Sử dụng `OpenAIDemo` component để test các tính năng:

```typescript
import OpenAIDemo from "@/components/openai/OpenAIDemo";

// Trong component của bạn
<OpenAIDemo />;
```

## Best Practices

### 1. Bảo mật

- Luôn kiểm tra `isOpenAIConfigured()` trước khi sử dụng
- Không log API responses chứa thông tin nhạy cảm
- Sử dụng environment variables

### 2. Performance

- Implement loading states
- Cache responses khi có thể
- Sử dụng appropriate temperature values:
  - 0.3-0.5: Factual, deterministic responses
  - 0.7-0.9: Creative, varied responses

### 3. Error Handling

- Luôn check `result.success` trước khi sử dụng data
- Implement fallback UI khi API fail
- Show meaningful error messages cho user

### 4. Cost Optimization

- Sử dụng gpt-3.5-turbo cho most cases (cheaper)
- Limit max_tokens appropriately
- Cache frequent requests

## Troubleshooting

### Lỗi thường gặp:

1. **"API key không được cấu hình"**

   - Check file `.env` có tồn tại không
   - Verify API key format (starts với sk-)

2. **"dangerouslyAllowBrowser warning"**

   - Normal for development
   - For production, consider proxy API calls through backend

3. **Rate limit exceeded**

   - OpenAI có giới hạn requests per minute
   - Implement retry logic hoặc request queuing

4. **Network errors**
   - Check internet connection
   - Verify OpenAI service status

## Ví dụ Integration với Result page

```typescript
// Trong src/pages/Result.tsx
import { getMajorRecommendation } from "@/integrations/openai";

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
