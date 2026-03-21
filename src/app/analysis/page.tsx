import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { AnalysisClient } from './AnalysisClient'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Match Analysis",
  description: "In-depth technical analysis and statistical trends for upcoming football matches.",
}

export default async function AnalysisPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  // Fetch upcoming matches for analysis
  const { data: matches } = await supabase
    .from('matches')
    .select('*, league:leagues(*), home_team:teams(*), away_team:teams(*)')
    .eq('status', 'scheduled')
    .order('kickoff_time', { ascending: true })
    .limit(20)

  return (
    <AppLayout profile={profile}>
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none uppercase italic">Match Analysis</h1>
            <p className="text-gray-400 font-medium text-lg max-w-2xl leading-relaxed">
              Deep-dive technical analysis and statistical trends for upcoming fixtures.
            </p>
          </div>
        </div>
      </header>

      <AnalysisClient initialMatches={matches || []} />
    </AppLayout>
  )
}
