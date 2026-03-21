import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/Card'
import { 
  Trophy, 
  Users, 
  Ticket, 
  TrendingUp, 
  Plus, 
  ShieldCheck, 
  Activity, 
  Users2, 
  ClipboardList, 
  CheckCircle2,
  Calendar,
  ChevronRight,
  Search,
  LayoutGrid,
  Bell,
  ArrowUpRight,
  Crown
} from 'lucide-react'
import Link from 'next/link'
import { Button, cn } from '@/components/Button'
import { Match, Pick } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Admin Command Center",
  description: "Platform management and content publishing overview.",
}

export default async function AdminDashboard() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  // Admin Security Check
  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Stats Fetching
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: premiumUsersCount } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'premium')
  const { count: matchesCount } = await supabase.from('matches').select('*', { count: 'exact', head: true })
  const { count: picksCount } = await supabase.from('picks').select('*', { count: 'exact', head: true })
  const { count: slipsCount } = await supabase.from('slips').select('*', { count: 'exact', head: true })
  const { count: pendingResultsCount } = await supabase.from('picks').select('*', { count: 'exact', head: true }).eq('result_status', 'pending')

  // Recent Subscriptions
  const { data: recentSubscriptions } = await supabase
    .from('subscriptions')
    .select('*, user:profiles(email, full_name)')
    .order('updated_at', { ascending: false })
    .limit(5)

  // Recent Saved Activity
  const { count: savedPicksCount } = await supabase.from('saved_picks').select('*', { count: 'exact', head: true })
  const { count: savedSlipsCount } = await supabase.from('saved_slips').select('*', { count: 'exact', head: true })

  const stats = [
    { name: 'Total Users', value: usersCount || 0, icon: Users2, color: 'text-blue-500', trend: 'Users' },
    { name: 'Premium Subs', value: premiumUsersCount || 0, icon: Crown, color: 'text-primary', trend: 'Revenue' },
    { name: 'Active Matches', value: matchesCount || 0, icon: Trophy, color: 'text-secondary', trend: 'Events' },
    { name: 'Total Picks', value: picksCount || 0, icon: ClipboardList, color: 'text-purple-500', trend: 'Content' },
    { name: 'Saved Items', value: (savedPicksCount || 0) + (savedSlipsCount || 0), icon: Bell, color: 'text-orange-500', trend: 'Engagement' },
    { name: 'Pending Results', value: pendingResultsCount || 0, icon: Activity, color: 'text-red-500', trend: 'Urgent' },
  ]

  // Recent Matches
  const { data: recentMatches } = await supabase
    .from('matches')
    .select('*, home_team:teams(*), away_team:teams(*), league:leagues(*)')
    .order('kickoff_time', { ascending: false })
    .limit(5)

  // Recent Picks
  const { data: recentPicks } = await supabase
    .from('picks')
    .select('*, match:matches(*, home_team:teams(*), away_team:teams(*))')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <AppLayout profile={profile}>
      <div className="space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="primary" className="px-4 py-1 text-[9px] font-black uppercase tracking-widest bg-primary/20">System Admin</Badge>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <Activity className="w-3 h-3 text-green-500" /> All Systems Operational
              </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Command Center</h1>
            <p className="text-gray-400 font-medium text-lg mt-2">Manage content board, user subscriptions, and system auditing.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/admin/matches/new">
              <Button variant="primary" className="h-12 px-6 font-black text-[10px] tracking-widest uppercase gap-2 shadow-lg shadow-primary/10">
                <Plus className="w-4 h-4" /> Add Match
              </Button>
            </Link>
            <Link href="/admin/slips/new">
              <Button variant="outline" className="h-12 px-6 border-white/10 font-black text-[10px] tracking-widest uppercase hover:bg-white/5 gap-2">
                <Plus className="w-4 h-4" /> Add Slip
              </Button>
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name} className="p-6 bg-card border-white/5 hover:border-white/10 transition-all group">
              <div className="flex flex-col gap-4">
                <div className={cn('w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center', stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">{stat.name}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white tracking-tighter">{stat.value}</span>
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">{stat.trend}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="xl:col-span-2 space-y-10">
            {/* Recent Matches */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white italic">Recent Fixtures</h2>
                </div>
                <Link href="/admin/matches" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                  Manage All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <Card className="bg-card border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5">
                  {(recentMatches as any[])?.map((match: Match) => (
                    <div key={match.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center gap-1 text-[10px] font-black text-gray-500 uppercase tracking-widest min-w-[80px]">
                          <Calendar className="w-4 h-4" />
                          {new Date(match.kickoff_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-lg font-black text-white group-hover:text-primary transition-colors uppercase italic">
                            {match.home_team?.name} v {match.away_team?.name}
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            {match.league?.name} • {new Date(match.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={match.status === 'finished' ? 'secondary' : 'pending'} className="font-black text-[9px] px-3 h-6 uppercase tracking-widest">
                          {match.status.toUpperCase()}
                        </Badge>
                        <Link href={`/admin/matches/edit/${match.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Quick Actions & System Info Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-secondary rounded-full" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white italic">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Bulk Update Results', icon: CheckCircle2, color: 'text-green-500' },
                    { label: 'Manage Leagues', icon: Trophy, color: 'text-primary' },
                    { label: 'Platform Settings', icon: Settings, color: 'text-blue-500' },
                    { label: 'Broadcast Alert', icon: Bell, color: 'text-orange-500' },
                  ].map((action, i) => (
                    <button key={i} className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all group">
                      <action.icon className={cn("w-6 h-6", action.color)} />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center group-hover:text-white">{action.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-purple-500 rounded-full" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white italic">System Status</h2>
                </div>
                <Card className="bg-card border-white/5 p-8 space-y-6">
                  <div className="space-y-4">
                    {[
                      { label: 'Database Health', value: 'Excellent', color: 'text-green-500' },
                      { label: 'Stripe API', value: 'Connected', color: 'text-green-500' },
                      { label: 'Supabase SSR', value: 'Active', color: 'text-green-500' },
                      { label: 'Worker Process', value: 'Running', color: 'text-blue-500' },
                    ].map((status, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{status.label}</span>
                        <span className={cn("text-[10px] font-black uppercase tracking-widest", status.color)}>{status.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-10">
            {/* Recent Picks */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white italic">Audit Log</h2>
                </div>
                <Link href="/admin/picks" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
              </div>
              <Card className="bg-card border-white/5 divide-y divide-white/5 overflow-hidden">
                {(recentPicks as any[])?.map((pick: Pick) => (
                  <div key={pick.id} className="p-5 hover:bg-white/5 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight">{pick.display_label}</span>
                      <span className="text-xs font-black text-primary">@{pick.odds.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest truncate max-w-[120px]">
                        {pick.match?.home_team?.name} v {pick.match?.away_team?.name}
                      </span>
                      <Badge variant={pick.result_status === 'won' ? 'won' : pick.result_status === 'lost' ? 'lost' : 'pending'} className="font-black text-[8px] px-2 h-5 uppercase tracking-widest">
                        {pick.result_status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </Card>
            </section>

            {/* Recent Subscriptions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white italic">Recent Subscriptions</h2>
                </div>
              </div>
              <Card className="bg-card border-white/5 divide-y divide-white/5 overflow-hidden">
                {recentSubscriptions?.map((sub: any) => (
                  <div key={sub.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Crown className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white group-hover:text-primary transition-colors uppercase italic">
                          {sub.user?.full_name || 'Anonymous User'}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          {sub.user?.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={sub.status === 'premium' ? 'primary' : 'outline'} className="font-black text-[8px] px-2 h-5 uppercase tracking-widest">
                        {sub.status?.toUpperCase()}
                      </Badge>
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">
                        {new Date(sub.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {(!recentSubscriptions || recentSubscriptions.length === 0) && (
                  <div className="p-10 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest italic">
                    No recent subscription activity.
                  </div>
                )}
              </Card>
            </section>

            {/* Quick User List */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-blue-500 rounded-full" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-white italic">Platform Engagement</h2>
                </div>
              </div>
              <Card className="bg-card border-white/5 p-8 text-center space-y-6">
                <div className="flex justify-around items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/5">
                      <Bookmark className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-white">{savedPicksCount || 0}</span>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Saved Picks</span>
                  </div>
                  <div className="w-px h-12 bg-white/5" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-secondary border border-white/5">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-white">{savedSlipsCount || 0}</span>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Saved Slips</span>
                  </div>
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-t border-white/5 pt-6">
                  Engagement metrics for platform analysis.
                </p>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

const Crown = (props: any) => (
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
    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.277 3.664a1 1 0 0 0 1.516-.294l2.951-5.605Z" />
    <path d="M5 21h14" />
  </svg>
)

const Bookmark = (props: any) => (
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
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
)

const Settings = (props: any) => (
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
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

