import Link from "next/link";
import { Zap } from "lucide-react";
import { Card } from "./Card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-black relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <header className="relative z-10 w-full p-6">
        <div className="container mx-auto flex justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <Zap className="w-5 h-5 text-black fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">EdgeBet <span className="text-primary group-hover:text-primary-light transition-colors">Football</span></span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">{title}</h1>
            <p className="text-gray-400 font-medium">{subtitle}</p>
          </div>
          
          <Card className="border-white/10 bg-[#121212]/80 backdrop-blur-xl shadow-2xl p-8 rounded-3xl relative group overflow-hidden">
            {/* Subtle card glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            {children}
          </Card>
        </div>
      </main>

      <footer className="relative z-10 p-6 text-center">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
          © 2026 EDGEBET FOOTBALL. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
