import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { DashboardClient } from './DashboardClient'
import { Target, TrendingUp, Award } from 'lucide-react'
import { Metadata } from 'next'
import { calculatePerformance } from '@/lib/utils/calculations'
import { checkIsPremium } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View today's top football picks, featured slips, and real-time performance stats.",
}

export default async function Dashboard() {
  const supabase = await createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  const isPremium = checkIsPremium(profile)

  // Fetch featured slips
  const { data: featuredSlips } = await supabase
    .from('slips')
    .select('*, items:slip_items(pick:picks(*, match:matches(*, league:leagues(*), home_team:teams(*), away_team:teams(*))))')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch individual picks
  const { data: latestPicks } = await supabase
    .from('picks')
    .select('*, match:matches(*, league:leagues(*), home_team:teams(*), away_team:teams(*))')
    .eq('result_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(8)

  // Fetch upcoming matches
  const { data: upcomingMatches } = await supabase
    .from('matches')
    .select('*, league:leagues(*), home_team:teams(*), away_team:teams(*)')
    .eq('status', 'scheduled')
    .gte('kickoff_time', new Date().toISOString())
    .order('kickoff_time', { ascending: true })
    .limit(5)

  // Fetch all settled picks for stats
  const { data: allPicks } = await supabase
    .from('picks')
    .select('result_status, odds, created_at')
    .neq('result_status', 'pending')

  const perf = calculatePerformance(allPicks || [])

  const stats = [
    { name: 'Hit Rate', value: `${perf.hitRate}%`, icon: Target, color: 'text-green-500' },
    { name: 'Avg. Odds', value: perf.avgOdds, icon: TrendingUp, color: 'text-primary' },
    { name: 'ROI', value: `${Number(perf.roi) > 0 ? '+' : ''}${perf.roi}%`, icon: Award, color: 'text-secondary' },
  ]

  return (
    <AppLayout profile={profile}>
      <DashboardClient 
        initialPicks={latestPicks || []}
        initialSlips={featuredSlips || []}
        initialMatches={upcomingMatches || []}
        profile={profile}
        isPremium={isPremium}
        stats={stats}
      />
    </AppLayout>
  )
}
