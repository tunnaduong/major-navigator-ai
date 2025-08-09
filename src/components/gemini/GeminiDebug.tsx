import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function GeminiDebug() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gemini Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            <strong>API Key Status:</strong>
            <br />
            {apiKey ? (
              <>
                ✅ API Key được tìm thấy
                <br />
                📏 Độ dài: {apiKey.length} ký tự
                <br />
                🔑 Bắt đầu với: {apiKey.substring(0, 20)}...
                <br />
                🔑 Kết thúc với: ...{apiKey.substring(apiKey.length - 10)}
              </>
            ) : (
              <>
                ❌ API Key không được tìm thấy
                <br />
                🔍 Environment: {JSON.stringify(import.meta.env, null, 2)}
              </>
            )}
          </AlertDescription>
        </Alert>

        <Alert>
          <AlertDescription>
            <strong>Environment Info:</strong>
            <br />
            🌍 Mode: {import.meta.env.MODE}
            <br />
            🏗️ Build: {import.meta.env.DEV ? "Development" : "Production"}
            <br />
            📦 Vite: {import.meta.env.VITE ? "True" : "False"}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
