import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import NewSlipForm from '@/components/admin/NewSlipForm'

export const dynamic = 'force-dynamic'

export default async function NewSlipPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  // Fetch only pending picks to include in a slip
  const { data: picks } = await supabase
    .from('picks')
    .select('*, match:matches(*, home_team:teams(*), away_team:teams(*))')
    .eq('result_status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <AppLayout profile={profile}>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Create Slip</h1>
        <p className="text-gray-400 font-medium">Group individual picks into a betting slip.</p>
      </header>
      <NewSlipForm picks={picks || []} />
    </AppLayout>
  )
}
