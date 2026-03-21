'use client'

import { useState, Suspense } from 'react'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { MobileNav } from './MobileNav'
import { Profile, cn, checkIsPremium } from '@/lib/supabase'
import { X, Zap, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from './LoadingSkeleton'
import Script from 'next/script'
import { AdSenseSlot } from './AdSenseSlot'

interface AppLayoutProps {
  children: React.ReactNode;
  profile: Profile | null;
}

function LayoutLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="h-12 w-1/3 bg-white/5 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />
        ))}
      </div>
      <div className="h-96 bg-white/5 rounded-[40px] animate-pulse" />
    </div>
  )
}

export function AppLayout({ children, profile }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isFakeMode = process.env.NEXT_PUBLIC_USE_FAKE_PAYMENTS === 'true'
  
  const isPremium = checkIsPremium(profile)
  const isAdmin = profile?.role === 'admin'
  const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const adsenseSlotBottom = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM
  const showAds = adsenseEnabled && !!adsenseClient && !!adsenseSlotBottom && !isPremium && !isAdmin

  return (
    <div className="flex min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      {/* Desktop Sidebar */}
      <Sidebar role={profile?.role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {isFakeMode && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 py-2 px-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-yellow-500 z-50">
            <AlertCircle className="w-3 h-3" />
            Test Mode Active – No Real Payments
          </div>
        )}
        <TopNav 
          profile={profile} 
          isPremium={!!isPremium} 
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />

        <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
          <Suspense fallback={<LayoutLoading />}>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
              {children}
              {showAds && (
                <div className="mt-10">
                  <Script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                  />
                  <AdSenseSlot slot={adsenseSlotBottom} />
                </div>
              )}
            </div>
          </Suspense>
        </main>

        {/* Mobile Bottom Bar */}
        <MobileNav />
      </div>
    </div>
  )
}
