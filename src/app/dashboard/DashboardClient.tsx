'use client'

import { useState, useEffect } from 'react'
import { MarketFilters } from '@/components/MarketFilters'
import { PickCard } from '@/components/PickCard'
import { SlipCard } from '@/components/SlipCard'
import { Pick, Slip } from '@/lib/supabase'
import { Crown, TrendingUp, Target, Award, ArrowRight, Calendar, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button, cn } from '@/components/Button'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/Card'
import { UpcomingMatchRow } from '@/components/UpcomingMatchRow'

type DashboardStatKey = 'hitRate' | 'avgOdds' | 'roi'

type DashboardStat = {
  key: DashboardStatKey
  name: string
  value: string
  color: string
}

interface DashboardClientProps {
  initialPicks: any[];
  initialSlips: any[];
  initialMatches: any[];
  profile: any;
  isPremium: boolean;
  stats: DashboardStat[];
}

export function DashboardClient({ 
  initialPicks, 
  initialSlips, 
  initialMatches, 
  profile, 
  isPremium, 
  stats 
}: DashboardClientProps) {
  const [activeMarket, setActiveMarket] = useState('all')
  const [showSuccess, setShowSuccess] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const filteredPicks = activeMarket === 'all' 
    ? initialPicks 
    : initialPicks.filter(p => p.selection_type?.toLowerCase() === activeMarket.toLowerCase())

  const safeSlip = initialSlips.find(s => s.type === 'safe' && s.status === 'pending')
  const comboSlip = initialSlips.find(s => (s.type === 'combo' || s.type === 'aggressive') && s.status === 'pending')

  const statIconMap: Record<DashboardStatKey, any> = {
    hitRate: Target,
    avgOdds: TrendingUp,
    roi: Award,
  }

  return (
    <div className="space-y-12">
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-green-500 text-black px-6 py-3 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
            <CheckCircle2 className="w-5 h-5" />
            Premium Access Activated
          </div>
        </div>
      )}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0]}!</h1>
            <p className="text-gray-400 font-medium">Your daily edge for today's top fixtures is ready.</p>
          </div>
          
          <div className="flex gap-4">
            {stats.map((stat) => (
              <Card key={stat.name} className="flex-1 min-w-[120px] px-4 py-3 bg-white/5 border-white/5 shadow-none hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = statIconMap[stat.key]
                    return <Icon className={cn('w-5 h-5', stat.color)} />
                  })()}
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">{stat.name}</span>
                    <span className="text-lg font-bold text-white">{stat.value}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </header>

      {/* Featured Slips Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Featured Daily Slips
          </h2>
          <Link href="/slips" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
            Browse all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {safeSlip ? (
            <SlipCard slip={safeSlip} isLocked={safeSlip.is_premium && !isPremium} />
          ) : (
             <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 text-sm italic">
               No featured safe slip available today.
             </div>
          )}

          {comboSlip ? (
            <SlipCard slip={comboSlip} isLocked={comboSlip.is_premium && !isPremium} />
          ) : (
            <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 flex flex-col justify-center p-8 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
              <h3 className="text-2xl font-bold mb-4 text-white leading-tight">Join our <span className="text-primary">Premium Insights</span></h3>
              <p className="text-gray-400 mb-8 max-w-[400px] font-medium leading-relaxed text-sm">
                Unlock high-confidence combo slips, full analyst reasoning, and pro betting strategies.
              </p>
              <div className="space-y-3 mb-8">
                {['100% Locked Slips Access', 'Exclusive Combo Market Picks', 'Priority Analyst Support'].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-xs font-bold text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </div>
                ))}
              </div>
              <Link href="/subscription">
                <Button variant="primary" className="w-full sm:w-auto px-12 h-12 text-sm font-black tracking-widest">GO PREMIUM</Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-12">
          
          {/* Market Filters & Today's Top Picks */}
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <h2 className="text-2xl font-bold text-white">Today's Top Picks</h2>
              <MarketFilters activeFilter={activeMarket} onFilterChange={setActiveMarket} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPicks.length > 0 ? (
                filteredPicks.map((pick) => (
                  <PickCard key={pick.id} pick={pick} isLocked={pick.premium_only && !isPremium} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-white/5 border-dashed">
                  <p className="text-gray-500 font-medium">No picks found for this market today.</p>
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Matches Preview */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Upcoming Fixtures</h2>
              <Link href="/analysis" className="text-primary hover:underline text-sm font-medium">View Schedule</Link>
            </div>
            
            <div className="space-y-4">
              {initialMatches.length > 0 ? (
                initialMatches.map((match) => (
                  <UpcomingMatchRow key={match.id} match={match} />
                ))
              ) : (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 italic text-gray-500">
                  No upcoming matches scheduled.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-12">
          {/* Upgrade CTA for Free Users */}
          {!isPremium && (
            <Card className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 border-none p-8 text-black relative overflow-hidden group">
              <Crown className="absolute -top-6 -right-6 w-32 h-32 opacity-20 rotate-12 group-hover:scale-110 transition-transform duration-700" />
              <h3 className="text-2xl font-black mb-3 leading-tight tracking-tight uppercase italic">Unlimited Edge</h3>
              <p className="text-black/80 font-bold text-sm mb-6 leading-relaxed">
                Get full access to all premium slips, picks and real-time alerts.
              </p>
              <Link href="/subscription">
                <Button variant="outline" className="w-full h-12 bg-black text-white border-black font-black tracking-widest hover:bg-black/90">UPGRADE NOW</Button>
              </Link>
            </Card>
          )}

          {/* Performance Summary Sidebar */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Results</h2>
            <Card className="bg-card/50 border-white/5 shadow-none overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-400">Past 5 Days Performance</CardTitle>
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {[
                  { date: 'March 15', status: 'won', profit: '+3.4u', count: '4/5' },
                  { date: 'March 14', status: 'lost', profit: '-1.0u', count: '2/5' },
                  { date: 'March 13', status: 'won', profit: '+5.2u', count: '5/5' },
                  { date: 'March 12', status: 'won', profit: '+2.1u', count: '3/4' },
                  { date: 'March 11', status: 'won', profit: '+1.8u', count: '3/5' },
                ].map((result, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{result.date}</span>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{result.count} Picks Won</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant={result.status === 'won' ? 'won' : 'lost'} className="font-black text-[10px] tracking-widest">{result.profit}</Badge>
                    </div>
                  </div>
                ))}
                <Link href="/history">
                  <Button variant="outline" className="w-full mt-2 h-11 text-[10px] font-black tracking-widest uppercase border-white/10 hover:bg-white/5">FULL HISTORY</Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
