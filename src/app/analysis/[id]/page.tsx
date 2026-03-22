import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award, 
  Zap, 
  ShieldCheck, 
  Flame,
  Search,
  ArrowRight,
  LineChart,
  BarChart3,
  Goal,
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lock,
  Crown
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cn, checkIsPremium } from '@/lib/supabase'

export default async function MatchAnalysisDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()
  const { id } = params

  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  const { data: match } = await supabase
    .from('matches')
    .select('*, league:leagues(*), home_team:teams(*), away_team:teams(*)')
    .eq('id', id)
    .single()

  if (!match) notFound()

  const isPremium = checkIsPremium(profile)
  const isLocked = match.premium_analysis && !isPremium

  return (
    <AppLayout profile={profile}>
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/analysis" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to analysis</span>
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/10 px-6 py-2">
              {match.league?.name}
            </Badge>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-black uppercase tracking-[0.2em]">
              <Calendar className="w-4 h-4" />
              {new Date(match.kickoff_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              <span className="text-gray-700 mx-2">•</span>
              <Clock className="w-4 h-4" />
              {new Date(match.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 md:gap-16 w-full">
            <div className="flex flex-col items-center gap-6 flex-1">
              <div className="w-24 md:w-32 h-24 md:h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/5 shadow-2xl overflow-hidden">
                {match.home_team?.logo_url ? (
                  <img src={match.home_team.logo_url} alt="" className="w-2/3 h-2/3 object-contain" />
                ) : (
                  <Trophy className="w-12 md:w-16 h-12 md:h-16 text-gray-700" />
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">{match.home_team?.name}</h1>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter">VS</span>
              <Badge variant="primary" className="text-[10px] font-black uppercase bg-primary/20 tracking-widest">Premium Edge</Badge>
            </div>
            <div className="flex flex-col items-center gap-6 flex-1">
              <div className="w-24 md:w-32 h-24 md:h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/5 shadow-2xl overflow-hidden">
                {match.away_team?.logo_url ? (
                  <img src={match.away_team.logo_url} alt="" className="w-2/3 h-2/3 object-contain" />
                ) : (
                  <Trophy className="w-12 md:w-16 h-12 md:h-16 text-gray-700" />
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">{match.away_team?.name}</h1>
            </div>
          </div>
        </div>

        {isLocked ? (
          <div className="p-12 md:p-20 rounded-[48px] bg-gradient-to-br from-primary/20 via-background to-background border border-primary/20 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
              <Crown className="w-64 h-64 text-primary" />
            </div>
            <div className="relative z-10 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/30">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Full Technical Report Locked</h2>
              <p className="text-gray-400 font-medium text-lg mb-10 leading-relaxed">
                Unlock 12+ statistical indicators, goal trends, and analyst-suggested markets for this fixture.
              </p>
              <Link href="/subscription">
                <Button variant="primary" className="px-12 h-14 font-black tracking-widest text-xs uppercase shadow-xl shadow-primary/20">
                  GET PREMIUM ACCESS
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <div className="xl:col-span-2 space-y-12">
              {/* Statistical Trends */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white">Statistical Trend Summary</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { title: 'Goal Trends', content: '7/10 matches ended with Over 2.5 goals. Home team scoring avg is 2.1.', icon: Goal, color: 'text-primary' },
                    { title: 'BTTS Trends', content: '80% of Home team fixtures this season ended with Both Teams to Score.', icon: Flame, color: 'text-orange-500' },
                    { title: 'First Half', content: 'Home team leads at HT in 60% of fixtures. Away team concedes early.', icon: Clock, color: 'text-blue-500' },
                    { title: 'H2H Analysis', content: 'Home team has won 4 out of the last 5 encounters against Away.', icon: ShieldCheck, color: 'text-green-500' },
                  ].map((trend, i) => (
                    <Card key={i} className="bg-white/5 border-white/5 p-8 group hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3 mb-6">
                        <trend.icon className={cn("w-6 h-6", trend.color)} />
                        <span className="text-sm font-black text-white uppercase tracking-widest">{trend.title}</span>
                      </div>
                      <p className="text-gray-400 font-medium leading-relaxed italic">"{trend.content}"</p>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Technical Analysis */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-6 bg-secondary rounded-full" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white">Technical Deep Dive</h2>
                </div>
                <Card className="bg-white/5 border-white/5 p-8 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" /> Analyst Observations
                    </h3>
                    <p className="text-gray-400 font-medium leading-relaxed text-lg italic">
                      "The Home team's offensive efficiency is currently at a seasonal high, averaging 14.5 shots per game with an XG of 1.95. Conversely, the Away team has struggled with defensive transitions, conceding 65% of their goals from fast breaks."
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Tactical Edge</h4>
                      <ul className="space-y-3">
                        {['High defensive line from Away team', 'Home team aerial advantage', 'Away team key playmaker out'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest">Key Metric Check</h4>
                      <div className="space-y-4">
                        {[
                          { label: 'Offensive Momentum', value: 'High', color: 'bg-primary' },
                          { label: 'Defensive Solidity', value: 'Medium', color: 'bg-white/20' },
                        ].map((metric, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                              <span>{metric.label}</span>
                              <span>{metric.value}</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full", metric.color)} style={{ width: metric.value === 'High' ? '85%' : '50%' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </section>
            </div>

            {/* Sidebar Suggestions */}
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white">Suggested Picks</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { market: 'Home Win', odds: '1.85', confidence: '8/10', risk: 'low' },
                    { market: 'BTTS - Yes', odds: '1.70', confidence: '9/10', risk: 'low' },
                    { market: 'Over 2.5 Goals', odds: '2.10', confidence: '7/10', risk: 'medium' },
                  ].map((pick, i) => (
                    <Card key={i} className="bg-white/5 border-white/5 p-6 hover:bg-white/10 transition-all cursor-pointer border-l-4 border-l-primary/30">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-lg font-black text-white uppercase tracking-tight">{pick.market}</span>
                        <span className="text-2xl font-black text-primary tracking-tighter">@{pick.odds}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Confidence</span>
                          <span className="text-xs font-black text-white">{pick.confidence}</span>
                        </div>
                        <Badge variant={pick.risk === 'low' ? 'secondary' : 'primary'} className="h-6 px-3 text-[9px] font-black uppercase tracking-widest bg-opacity-10 border-0">
                          {pick.risk} Risk
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>

                <Link href="/slips" className="block mt-8">
                  <Button variant="outline" className="w-full h-14 font-black text-[10px] tracking-[0.2em] uppercase border-white/10 hover:bg-primary hover:text-black hover:border-primary">
                    View Related Slips <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </section>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
