import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Bell, ChevronRight, Lock, ShieldCheck, UserRound } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  return (
    <AppLayout profile={profile}>
      <div className="max-w-4xl mx-auto py-8 space-y-10">
        <header>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Account</p>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Account Settings</h1>
          <p className="mt-3 text-sm text-gray-500">Manage your preferences, security, and account details.</p>
        </header>

        <Card className="bg-white/5 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg uppercase tracking-widest">
              <UserRound className="w-5 h-5 text-primary" /> Profile details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-4">
              <div>
                <p className="text-sm font-bold text-white">{profile?.full_name || 'Your profile'}</p>
                <p className="text-xs text-gray-500">{profile?.email || session?.user?.email || 'No email available'}</p>
              </div>
              <Link href="/profile" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-white">
                My Account <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/5 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg uppercase tracking-widest">
                <Bell className="w-5 h-5 text-primary" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-400">
              <p>Choose which EdgeBet updates you want to receive.</p>
              <button type="button" className="flex w-full items-center justify-between rounded-xl border border-white/10 p-3 text-left hover:bg-white/5">
                <span className="font-bold text-white">Match and slip alerts</span>
                <span className="text-xs font-black uppercase tracking-widest text-primary">Enabled</span>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5 text-primary" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-400">
              <p>Keep your account protected with strong credentials.</p>
              <Link href="/forgot-password" className="flex items-center justify-between rounded-xl border border-white/10 p-3 font-bold text-white hover:bg-white/5">
                <span className="flex items-center gap-3"><Lock className="w-4 h-4 text-gray-500" /> Change password</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
