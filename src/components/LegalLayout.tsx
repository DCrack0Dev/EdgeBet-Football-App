'use client'

import { PublicNavbar } from './PublicNavbar'
import { Footer } from './Footer'

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  lastUpdated?: string;
}

export function LegalLayout({ children, title, subtitle, lastUpdated }: LegalLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white selection:bg-primary selection:text-black font-sans">
      <PublicNavbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="mb-16">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 uppercase italic">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-gray-400 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
            {lastUpdated && (
              <div className="mt-8 flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                  Last Updated: {lastUpdated}
                </p>
              </div>
            )}
          </header>

          <div className="prose prose-invert prose-primary max-w-none 
            prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase prose-headings:italic
            prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-lg
            prose-li:text-gray-400 prose-li:leading-relaxed prose-li:text-lg
            prose-strong:text-white prose-strong:font-bold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-hr:border-white/5">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
