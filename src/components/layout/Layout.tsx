import { Header } from "./Header";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AI Major Advisor – FPT Polytechnic
      </footer>
    </div>
  );
}
