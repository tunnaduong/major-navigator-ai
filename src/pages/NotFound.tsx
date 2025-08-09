import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import GeminiDemo from "@/components/gemini/GeminiDemo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 rounded-lg border bg-card shadow-soft">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Oops! Page not found
        </p>
        <a href="/" className="underline text-primary">
          Quay về Trang chủ
        </a>
      </div>
      <GeminiDemo />
    </div>
  );
};

export default NotFound;
