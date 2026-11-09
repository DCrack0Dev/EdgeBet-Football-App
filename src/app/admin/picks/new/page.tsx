import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import NewPickForm from '@/components/admin/NewPickForm'

export const dynamic = 'force-dynamic'

export default async function NewPickPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  const { data: matches } = await supabase
    .from('matches')
    .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
    .order('kickoff_time', { ascending: true })

  return (
    <AppLayout profile={profile}>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Create Pick</h1>
        <p className="text-gray-400 font-medium">Add a market selection to an upcoming match.</p>
      </header>
      <NewPickForm matches={matches || []} />
    </AppLayout>
  )
}
