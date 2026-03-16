import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import NewMatchForm from '@/components/admin/NewMatchForm'

export default async function NewMatchPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  const { data: leagues } = await supabase.from('leagues').select('*').order('name')
  const { data: teams } = await supabase.from('teams').select('*').order('name')

  return (
    <AppLayout profile={profile}>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Create Match</h1>
        <p className="text-gray-400 font-medium">Add a new upcoming match to the system.</p>
      </header>
      <NewMatchForm leagues={leagues || []} teams={teams || []} />
    </AppLayout>
  )
}
