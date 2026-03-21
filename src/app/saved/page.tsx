import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Crown, 
  Calendar, 
  Clock, 
  ArrowRight,
  Target,
  Zap,
  LayoutGrid,
  ChevronRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/supabase'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Saved Picks",
  description: "Manage your personalized betting insights and saved selections.",
}

export default async function SavedPicksPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  const isPremium = profile?.subscriptions?.some((s: any) => s.status === 'premium') || profile?.role === 'admin'

  // Fetch saved picks from junction table
  const { data: savedPicks } = await supabase
    .from('saved_picks')
    .select('*, pick:picks(*, match:matches(*, league:leagues(*), home_team:teams(*), away_team:teams(*)))')
    .eq('user_id', session?.user?.id)
    .order('created_at', { ascending: false })

  // Fetch saved slips from junction table
  const { data: savedSlips } = await supabase
    .from('saved_slips')
    .select('*, slip:slips(*, items:slip_items(pick:picks(*, match:matches(*, league:leagues(*), home_team:teams(*), away_team:teams(*)))))')
    .eq('user_id', session?.user?.id)
    .order('created_at', { ascending: false })

  return (
    <AppLayout profile={profile}>
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none uppercase italic">Saved Insights</h1>
            <p className="text-gray-400 font-medium text-lg max-w-2xl leading-relaxed">
              Your personal edge. High-confidence selections saved for your review.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 px-6 border-white/10 gap-2 font-black text-[10px] tracking-widest uppercase">
              <LayoutGrid className="w-4 h-4" /> Manage All
            </Button>
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {/* Saved Picks Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Saved Individual Picks</h2>
            <Badge variant="outline" className="ml-2 bg-white/5 border-white/10">{savedPicks?.length || 0}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {savedPicks?.map((saved: any) => {
              const pick = saved.pick
              return (
                <Card key={saved.id} className="bg-card border-white/5 overflow-hidden group hover:border-primary/20 transition-all duration-300">
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1.5">
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white/5 border-white/10">
                          {pick.match?.league?.name}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(pick.match?.kickoff_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white tracking-tight uppercase italic group-hover:text-primary transition-colors">
                        {pick.match?.home_team?.name} v {pick.match?.away_team?.name}
                      </h3>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Market</span>
                          <span className="text-sm font-black text-white uppercase">{pick.display_label}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Odds</span>
                          <span className="text-2xl font-black text-primary tracking-tighter">@{pick.odds?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <Link href={`/analysis/${pick.match_id}`} className="block flex-1">
                        <Button variant="outline" className="w-full h-11 text-[9px] font-black tracking-widest uppercase border-white/10 hover:bg-white/5">
                          Open Analysis <ChevronRight className="w-3 h-3 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}

            {(!savedPicks || savedPicks.length === 0) && (
              <div className="col-span-full py-24 text-center bg-white/5 rounded-[40px] border-2 border-dashed border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No saved picks</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">Save picks and slips to keep track of your favorites across the platform.</p>
                <Link href="/slips">
                  <Button variant="primary" className="px-8 h-12 font-black tracking-widest text-[10px] uppercase italic shadow-lg shadow-primary/10">
                    Discover Tips <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Saved Slips Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-secondary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Saved Combo Slips</h2>
            <Badge variant="outline" className="ml-2 bg-white/5 border-white/10">{savedSlips?.length || 0}</Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {savedSlips?.map((saved: any) => {
              const slip = saved.slip
              const items = slip.items?.map((item: any) => item.pick || item)
              
              return (
                <Card key={saved.id} className="flex flex-col h-full border-l-4 border-l-primary/50 group hover:border-l-primary transition-all duration-300 border-white/5 bg-card relative overflow-hidden">
                  <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1.5">
                        <Badge 
                          variant={slip.type === 'safe' ? 'secondary' : slip.type === 'balanced' ? 'primary' : 'danger'}
                          className="bg-opacity-10 text-[9px] font-black tracking-widest w-fit"
                        >
                          {slip.type?.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                          <Calendar className="w-3.5 h-3.5" />
                          Saved {new Date(saved.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {slip.status !== 'pending' && (
                          <Badge variant={slip.status === 'won' ? 'won' : 'lost'} className="text-[9px] font-black uppercase tracking-widest">
                            {slip.status?.toUpperCase()}
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase italic group-hover:text-primary transition-colors mb-2">
                        {slip.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2">{slip.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Total Odds</span>
                        <span className="text-2xl font-black text-primary tracking-tighter">{slip.total_odds?.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Selections</span>
                        <span className="text-2xl font-black text-white tracking-tighter">{items?.length || 0}</span>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      {items?.slice(0, 2).map((item: any, idx: number) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white leading-tight">
                              {item.match?.home_team?.name} v {item.match?.away_team?.name}
                            </span>
                            <span className="text-[9px] text-primary font-black uppercase tracking-tight mt-0.5">{item.display_label}</span>
                          </div>
                          <span className="text-[10px] font-black text-gray-400">@{item.odds?.toFixed(2)}</span>
                        </div>
                      ))}
                      {items?.length > 2 && (
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest text-center mt-2">
                          + {items.length - 2} more selections
                        </p>
                      )}
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-auto">
                      <Link href={`/slips/${slip.id}`} className="block">
                        <Button variant="outline" className="w-full h-11 text-[9px] font-black tracking-widest uppercase border-white/10 hover:bg-white/5">
                          View Full Slip <ChevronRight className="w-3 h-3 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}

            {(!savedSlips || savedSlips.length === 0) && (
              <div className="col-span-full py-20 text-center bg-white/5 rounded-[32px] border border-white/5 border-dashed">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No saved slips</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6 font-medium">Keep your favorite combo slips here for quick access.</p>
                <Link href="/slips">
                  <Button variant="outline" className="px-6 h-11 font-black tracking-widest text-[9px] uppercase border-white/10">
                    Browse Daily Slips
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
