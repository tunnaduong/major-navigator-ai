import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import logoFPT from "@/assets/logo-fpt-polytechnic.jpg";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    if (stored) {
      root.classList.toggle("dark", stored === "dark");
      setIsDark(stored === "dark");
    }
  }, []);
  const toggle = () => {
    const root = document.documentElement;
    const nextIsDark = !isDark;
    root.classList.toggle("dark", nextIsDark);
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    setIsDark(nextIsDark);
  };
  return (
    <Button
      variant="soft"
      size="sm"
      aria-label="Toggle dark mode"
      onClick={toggle}
    >
      {isDark ? "🌙" : "☀️"}
    </Button>
  );
}

export const Header = () => {
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-primary" : "text-foreground/80 hover:text-foreground";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoFPT}
            alt="FPT Polytechnic Logo"
            className="size-8 rounded-md object-cover"
          />
          <span className="font-semibold">AI Major Advisor</span>
          <span className="text-muted-foreground hidden sm:inline">
            — FPT Polytechnic
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <NavLink to="/" className={getNavCls} end>
            Trang chủ
          </NavLink>
          <NavLink to="/quiz" className={getNavCls}>
            Tư vấn
          </NavLink>
          <NavLink to="/history" className={getNavCls}>
            Lịch sử
          </NavLink>
          <NavLink to="/about" className={getNavCls}>
            About
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};
