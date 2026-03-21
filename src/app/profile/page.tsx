import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { 
  User, 
  Mail, 
  Crown, 
  Calendar, 
  Bell, 
  Bookmark, 
  Lock, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Activity,
  Award,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/supabase'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "User Profile",
  description: "Manage your account settings, notification preferences, and subscription status.",
}

export default async function ProfilePage() {
  const supabase = await createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  const activeSub = profile?.subscriptions?.find((s: any) => s.status === 'premium')
  const isPremium = !!activeSub || profile?.role === 'admin'

  // Fetch saved picks count
  const { count: savedCount } = await supabase
    .from('saved_picks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session?.user?.id)

  const profileStats = [
    { label: 'Saved Picks', value: savedCount || 0, icon: Bookmark, color: 'text-primary' },
    { label: 'Win Ratio', value: '74%', icon: Award, color: 'text-green-500' },
    { label: 'Platform Tier', value: isPremium ? 'Premium' : 'Free', icon: Crown, color: isPremium ? 'text-primary' : 'text-gray-500' },
  ]

  return (
    <AppLayout profile={profile}>
      <div className="max-w-6xl mx-auto py-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-24 md:w-32 h-24 md:h-32 rounded-[32px] bg-primary/20 flex items-center justify-center border-2 border-primary/30 shadow-2xl shadow-primary/10 overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <User className="w-12 h-12 text-primary" />
                )}
              </div>
              {isPremium && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-background shadow-lg">
                  <Crown className="w-5 h-5 text-black" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-none">{profile?.full_name || 'Anonymous User'}</h1>
                {isPremium && <Badge variant="primary" className="text-[9px] font-black uppercase tracking-widest bg-primary/20">PREMIUM PRO</Badge>}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                  <Mail className="w-3.5 h-3.5" /> {profile?.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-bold text-[10px] uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" /> Joined {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/subscription">
              <Button variant="outline" className="h-12 px-6 border-white/10 gap-2 font-black text-[10px] tracking-widest uppercase hover:bg-white/5">
                {isPremium ? 'Manage Subscription' : 'Upgrade Edge'}
              </Button>
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {profileStats.map((stat, i) => (
            <Card key={i} className="bg-white/5 border-white/5 p-8 flex items-center gap-6">
              <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                <span className="text-2xl font-black text-white tracking-tighter">{stat.value}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Main Profile Settings */}
          <div className="xl:col-span-2 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h2 className="text-xl font-black uppercase tracking-widest text-white">Preference Hub</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/5 p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Notification Alerts</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { id: 'new_slips', label: 'New Daily Slips', active: true },
                      { id: 'premium_slips', label: 'Premium Analysis Alerts', active: true },
                      { id: 'results', label: 'Pick Outcome Alerts', active: false },
                      { id: 'weekly', label: 'Weekly Performance Report', active: true },
                    ].map((pref, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400">{pref.label}</span>
                        <button 
                          className={cn(
                            "w-10 h-5 rounded-full p-1 transition-colors relative",
                            pref.active ? "bg-primary" : "bg-white/10"
                          )}
                        >
                          <div className={cn(
                            "w-3 h-3 rounded-full bg-white transition-transform duration-200",
                            pref.active ? "translate-x-5" : "translate-x-0"
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-white/5 border-white/5 p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-5 h-5 text-secondary" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Favorite Leagues</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Premier League', 'La Liga', 'Champions League', 'Serie A'].map((league) => (
                      <Badge key={league} variant="outline" className="px-4 py-2 text-[9px] font-black uppercase bg-white/5 border-white/10 text-gray-400 cursor-pointer hover:text-white transition-colors">
                        {league}
                      </Badge>
                    ))}
                    <button className="px-4 py-2 rounded-full border border-dashed border-white/20 text-[9px] font-black uppercase text-gray-600 hover:text-primary transition-colors">
                      + Add League
                    </button>
                  </div>
                </Card>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 bg-secondary rounded-full" />
                <h2 className="text-xl font-black uppercase tracking-widest text-white">Security & Account</h2>
              </div>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black text-white uppercase tracking-widest block mb-1">Change Password</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Update your security credentials</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>

                <button className="w-full flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black text-white uppercase tracking-widest block mb-1">Two-Factor Auth</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-primary italic">Highly Recommended</span>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">Enable</div>
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8">Subscription Status</h2>
              <Card className={cn(
                "p-8 relative overflow-hidden",
                isPremium ? "bg-gradient-to-br from-primary/20 via-background to-background border-primary/20" : "bg-white/5 border-white/5"
              )}>
                {isPremium ? (
                  <>
                    <Crown className="absolute -top-4 -right-4 w-20 h-20 text-primary opacity-10 rotate-12" />
                    <div className="space-y-6 relative z-10">
                      <div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-2">Active Plan</span>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Premium Pro</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <span>Next Billing</span>
                          <span className="text-white">April 16, 2026</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <span>Auto-renew</span>
                          <span className="text-green-500">Enabled</span>
                        </div>
                      </div>
                      <Link href="/subscription">
                        <Button variant="outline" className="w-full h-12 border-white/10 text-[10px] font-black uppercase tracking-widest">Manage Billing</Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-gray-700">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-widest italic mb-2">Free Plan</h3>
                      <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-widest">Upgrade to unlock all high-confidence slips and analyst analysis.</p>
                    </div>
                    <Link href="/subscription">
                      <Button variant="primary" className="w-full h-12 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Go Premium Now</Button>
                    </Link>
                  </div>
                )}
              </Card>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8">Legal & Compliance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Terms of Service', href: '/terms', icon: ShieldCheck },
                  { name: 'Privacy Policy', href: '/privacy', icon: Lock },
                  { name: 'Responsible Gambling', href: '/responsible-gambling', icon: Activity },
                  { name: 'Risk Disclaimer', href: '/disclaimer', icon: AlertTriangle },
                ].map((link) => (
                  <Link key={link.name} href={link.href}>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                        <link.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{link.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8">Danger Zone</h2>
              <button className="w-full flex items-center gap-4 p-6 bg-red-500/5 rounded-2xl border border-red-500/10 hover:bg-red-500/10 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <LogOut className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-black text-red-500 uppercase tracking-widest block mb-1">Sign Out</span>
                  <span className="text-[10px] font-bold text-red-900 uppercase tracking-widest">End your current session</span>
                </div>
              </button>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
