import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { DashboardClient } from './DashboardClient'
import { Metadata } from 'next'
import { calculatePerformance } from '@/lib/utils/calculations'
import { checkIsPremium } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View today's top football picks, featured slips, and real-time performance stats.",
}

export default async function Dashboard({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const supabase = await createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  const isPremium = checkIsPremium(profile)

  // Fetch featured slips
  const featuredSlipsResult = await supabase
    .from('slips')
    .select('*, items:slip_items(pick:picks(*, match:matches(*, league:leagues(*), home_team:teams(*), away_team:teams(*))))')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch individual picks
  const latestPicksResult = await supabase
    .from('picks')
    .select('*, match:matches(*, league:leagues(*), home_team:teams(*), away_team:teams(*))')
    .eq('result_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(8)

  // Fetch upcoming matches
  const upcomingMatchesResult = await supabase
    .from('matches')
    .select('*, league:leagues(*), home_team:teams(*), away_team:teams(*)')
    .eq('status', 'scheduled')
    .gte('kickoff_time', new Date().toISOString())
    .order('kickoff_time', { ascending: true })
    .limit(5)

  // Fetch all settled picks for stats
  const allPicksResult = await supabase
    .from('picks')
    .select('result_status, odds, created_at')
    .neq('result_status', 'pending')

  const perf = calculatePerformance(allPicksResult.data || [])

  const stats = [
    { key: 'hitRate', name: 'Hit Rate', value: `${perf.hitRate}%`, color: 'text-green-500' },
    { key: 'avgOdds', name: 'Avg. Odds', value: perf.avgOdds, color: 'text-primary' },
    { key: 'roi', name: 'ROI', value: `${Number(perf.roi) > 0 ? '+' : ''}${perf.roi}%`, color: 'text-secondary' },
  ] satisfies { key: 'hitRate' | 'avgOdds' | 'roi'; name: string; value: string; color: string }[]

  const plain = searchParams?.plain === '1'
  if (plain) {
    return (
      <div className="min-h-screen bg-background text-white p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-sm font-black uppercase tracking-widest">Dashboard Debug</div>
          <pre className="text-xs bg-white/5 border border-white/10 rounded-2xl p-4 overflow-auto">
{JSON.stringify(
  {
    session: { hasSession: !!session?.user?.id, userId: session?.user?.id || null },
    profile: { id: profile?.id || null, role: profile?.role || null },
    featuredSlips: { count: featuredSlipsResult.data?.length ?? null, error: featuredSlipsResult.error?.message || null },
    latestPicks: { count: latestPicksResult.data?.length ?? null, error: latestPicksResult.error?.message || null },
    upcomingMatches: { count: upcomingMatchesResult.data?.length ?? null, error: upcomingMatchesResult.error?.message || null },
    allPicks: { count: allPicksResult.data?.length ?? null, error: allPicksResult.error?.message || null },
  },
  null,
  2
)}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <AppLayout profile={profile}>
      <DashboardClient 
        initialPicks={latestPicksResult.data || []}
        initialSlips={featuredSlipsResult.data || []}
        initialMatches={upcomingMatchesResult.data || []}
        profile={profile}
        isPremium={isPremium}
        stats={stats}
      />
    </AppLayout>
  )
}
