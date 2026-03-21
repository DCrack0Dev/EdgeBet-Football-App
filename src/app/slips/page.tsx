import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { Badge } from '@/components/Card'
import { Button } from '@/components/Button'
import { Calendar, Crown } from 'lucide-react'
import { SlipsClient } from './SlipsClient'
import Link from 'next/link'
import { Metadata } from 'next'
import { checkIsPremium } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Daily Slips",
  description: "Browse expertly curated daily betting slips across multiple risk levels and markets.",
}

export default async function SlipsPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  const isPremium = checkIsPremium(profile)

  // Fetch all active slips and standalone picks
  const [{ data: slips }, { data: standalonePicks }] = await Promise.all([
    supabase
      .from('slips')
      .select('*, items:slip_items(pick:picks(*, match:matches(*, league:leagues(*), home_team:teams(*), away_team:teams(*))))')
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('picks')
      .select('*, match:matches(*, league:leagues(*), home_team:teams(*), away_team:teams(*))')
      .order('created_at', { ascending: false })
  ])

  return (
    <AppLayout profile={profile}>
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              Daily Betting Tips
              <Badge variant="primary" className="text-xs font-black uppercase">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Badge>
            </h1>
            <p className="text-gray-400 font-medium">Carefully curated selections by our expert analysts.</p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" size="sm" className="gap-2 h-11 px-5 border-white/10 font-bold">
              <Calendar className="w-4 h-4" />
              SELECT DATE
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Premium Slip Gating Banner */}
      {!isPremium && (
        <div className="mb-12 p-8 rounded-[32px] bg-gradient-to-r from-primary/20 via-primary/5 to-background border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
            <Crown className="w-32 h-32 text-primary rotate-12" />
          </div>
          <div className="flex-1 relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              Unlock High-Value Premium Slips
            </h2>
            <p className="text-gray-400 max-w-[600px] mb-6 font-medium leading-relaxed">
              Premium users get access to exclusive combo slips with higher odds and full analyst reasoning. Start your winning streak today!
            </p>
            <div className="flex gap-4">
              <Link href="/subscription">
                <Button variant="primary" className="px-8 h-12 font-black tracking-widest">SUBSCRIBE NOW</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5 relative z-10 backdrop-blur-sm min-w-[180px]">
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Average Profit</span>
            <span className="text-4xl font-black text-primary">+18.5u</span>
            <span className="text-[10px] text-gray-400 mt-1 font-bold italic text-center">PAST 30 DAYS</span>
          </div>
        </div>
      )}

      <SlipsClient 
        initialSlips={slips || []} 
        initialPicks={standalonePicks || []}
        isPremium={isPremium} 
      />
    </AppLayout>
  )
}
