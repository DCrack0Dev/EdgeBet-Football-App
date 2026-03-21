import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { Badge, Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { 
  ChevronLeft, 
  Crown, 
  Calendar, 
  Target, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Bookmark, 
  Share2,
  Lock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { cn, checkIsPremium } from '@/lib/supabase'
import { SaveSlipButton } from '@/components/SaveSlipButton'
import { SlipAdUnlockOverlay } from '@/components/SlipAdUnlockOverlay'

export const dynamic = 'force-dynamic'

export default async function SlipDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { id } = params

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    redirect(`/login?redirect=/slips/${id}/id`)
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  const premiumUser = checkIsPremium(profile)

  const { data: slip } = await supabase
    .from('slips')
    .select('*, items:slip_items(pick:picks(*, match:matches(*, league:leagues(*), home_team:teams(*), away_team:teams(*))))')
    .eq('id', id)
    .single()

  if (!slip || !slip.is_published) notFound()

  const isLocked = slip.is_premium && !premiumUser
  const needsAdUnlock = !slip.is_premium && !premiumUser

  const today = new Date()
  const unlockDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
    .toISOString()
    .slice(0, 10)

  const { count: usedToday } = await supabase
    .from('slip_unlocks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .eq('unlock_date', unlockDate)

  const { count: unlockedThisSlipToday } = await supabase
    .from('slip_unlocks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .eq('unlock_date', unlockDate)
    .eq('slip_id', id)

  const isUnlockedToday = (unlockedThisSlipToday || 0) > 0
  const remainingToday = Math.max(0, 1 - (usedToday || 0))

  // Check if slip is already saved
  const { data: savedStatus } = await supabase
    .from('saved_slips')
    .select('id')
    .eq('user_id', session?.user?.id)
    .eq('slip_id', id)
    .single()
  
  const initialIsSaved = !!savedStatus

  // Standardize items structure
  const items = slip.items?.map((item: any) => item.pick || item)

  // Calculate stats
  const avgConfidence = items?.length 
    ? (items.reduce((acc: number, item: any) => acc + (item.confidence_score || 0), 0) / items.length).toFixed(1)
    : '0.0'

  return (
    <AppLayout profile={profile}>
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/slips" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to all slips</span>
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge 
                variant={slip.type === 'safe' ? 'secondary' : slip.type === 'balanced' ? 'primary' : 'danger'}
                className="bg-opacity-10 text-[10px] font-black tracking-[0.2em]"
              >
                {slip.type?.toUpperCase()}
              </Badge>
              {slip.is_premium && (
                <Badge variant="primary" className="text-[10px] font-black tracking-[0.2em] bg-primary/20">
                  <Crown className="w-3 h-3 mr-1" /> PREMIUM
                </Badge>
              )}
              {slip.status !== 'pending' && (
                <Badge variant={slip.status === 'won' ? 'won' : 'lost'} className="text-[10px] font-black tracking-[0.2em]">
                  {slip.status?.toUpperCase()}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-none">
              {slip.title}
            </h1>
            <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-2xl">
              {slip.description || "Expertly analyzed combo slip for today's top football fixtures."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SaveSlipButton slipId={id} initialIsSaved={initialIsSaved} />
            <Button variant="outline" className="h-12 px-6 border-white/10 gap-2 font-black text-[10px] tracking-widest uppercase">
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>

        {needsAdUnlock && !isUnlockedToday && (
          <div className="relative mb-12 rounded-[48px] border border-white/5 bg-white/5 overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <AlertCircle className="w-3.5 h-3.5 text-primary" />
                Unlock required to view slip selections
              </div>
              <div className="mt-4 text-sm text-gray-400 font-medium leading-relaxed max-w-2xl">
                Free users can unlock 1 slip per day by viewing an ad.
              </div>
            </div>
            <SlipAdUnlockOverlay slipId={id} remainingToday={remainingToday} />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Odds', value: slip.total_odds?.toFixed(2), icon: Zap, color: 'text-primary' },
            { label: 'Selections', value: items?.length || 0, icon: Target, color: 'text-white' },
            { label: 'Avg Confidence', value: `${avgConfidence}/10`, icon: ShieldCheck, color: 'text-green-500' },
            { label: 'Risk Level', value: slip.type?.toUpperCase(), icon: Flame, color: 'text-orange-500' },
          ].map((stat, i) => (
            <Card key={i} className="bg-white/5 border-white/5 p-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                <div className="flex items-center gap-3 mt-1">
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                  <span className="text-2xl font-black text-white tracking-tight">{stat.value}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Gating Section */}
        {isLocked ? (
          <div className="p-12 md:p-20 rounded-[48px] bg-gradient-to-br from-primary/20 via-background to-background border border-primary/20 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
              <Crown className="w-64 h-64 text-primary" />
            </div>
            <div className="relative z-10 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/30">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Content Locked</h2>
              <p className="text-gray-400 font-medium text-lg mb-10 leading-relaxed">
                This high-value slip is reserved for our Premium members. Join today to unlock expert analysis and boost your ROI.
              </p>
              <Link href="/subscription">
                <Button variant="primary" className="px-12 h-14 font-black tracking-widest text-xs uppercase">
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          </div>
        ) : needsAdUnlock && !isUnlockedToday ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Slip Selections</h2>
            </div>
            <div className="p-10 rounded-[32px] bg-white/5 border border-white/5 text-center text-gray-500 text-xs font-black uppercase tracking-widest">
              Unlock this slip to view selections
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Slip Selections</h2>
            </div>

            <div className="grid gap-6">
              {items?.map((item: any, idx: number) => (
                <Card key={item.id} className="bg-white/5 border-white/5 overflow-hidden group hover:border-primary/20 transition-all duration-300">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    {/* Selection Info */}
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/10">
                            {item.match?.league?.name}
                          </Badge>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(item.match?.kickoff_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            <span className="text-gray-700">•</span>
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(item.match?.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-primary transition-colors">
                          {item.match?.home_team?.name} <span className="text-gray-600 font-medium italic">v</span> {item.match?.away_team?.name}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 block">Selection</span>
                          <span className="text-xl font-black text-white uppercase tracking-tight">{item.display_label}</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-end">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 block">Odds</span>
                            <span className="text-3xl font-black text-primary tracking-tighter">@{item.odds?.toFixed(2)}</span>
                          </div>
                          {item.result_status !== 'pending' && (
                            <Badge variant={item.result_status === 'won' ? 'won' : 'lost'} className="h-8 px-4 font-black uppercase tracking-widest">
                              {item.result_status?.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {item.analyst_reason && (
                        <div className="relative p-6 bg-white/5 rounded-[24px] border border-white/5 group-hover:bg-white/10 transition-colors">
                          <div className="absolute -top-2 left-6 px-2 bg-background text-[9px] font-black text-primary uppercase tracking-[0.2em]">Analyst Rationale</div>
                          <p className="text-gray-400 leading-relaxed font-medium italic text-lg">
                            "{item.analyst_reason}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Stats Sidebar */}
                    <div className="w-full md:w-64 space-y-4 pt-4 md:pt-0">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 block">Confidence</span>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-black text-white">{item.confidence_score}/10</span>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(10)].map((_, i) => (
                              <div 
                                key={i} 
                                className={cn(
                                  "h-2 flex-1 rounded-full",
                                  i < (item.confidence_score || 0) ? "bg-primary" : "bg-white/10"
                                )} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Risk level</span>
                        <Badge 
                          variant={item.risk_level === 'low' ? 'secondary' : item.risk_level === 'medium' ? 'primary' : 'danger'}
                          className="bg-opacity-10 text-[10px] font-black tracking-widest h-7 px-4 uppercase border-0"
                        >
                          {item.risk_level?.toUpperCase()}
                        </Badge>
                      </div>

                      <Link href={`/analysis/${item.match?.id}`}>
                        <Button variant="ghost" className="w-full h-12 text-[10px] font-black tracking-[0.2em] uppercase text-gray-500 hover:text-primary hover:bg-white/5">
                          Detailed Match View <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

const Flame = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
)

const ChevronRight = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)
