import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/Card'
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Lock, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { Button, cn } from '@/components/Button'
import { redirect } from 'next/navigation'

export default async function ManagePicksPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch all picks with match and team data
  const { data: picks } = await supabase
    .from('picks')
    .select('*, match:matches(*, home_team:teams(*), away_team:teams(*), league:leagues(*))')
    .order('created_at', { ascending: false })

  return (
    <AppLayout profile={profile}>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Manage Picks</h1>
            <p className="text-gray-400 font-medium text-lg mt-2">Create and manage individual market selections and combo picks.</p>
          </div>
          
          <Link href="/admin/picks/new">
            <Button variant="primary" className="h-12 px-8 font-black text-[10px] tracking-widest uppercase gap-2 shadow-lg shadow-primary/10">
              <Plus className="w-4 h-4" /> Create New Pick
            </Button>
          </Link>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search picks by team, league or label..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
              <Filter className="w-3.5 h-3.5 text-gray-500 ml-2" />
              <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none pr-4 cursor-pointer">
                <option value="">All Markets</option>
                <option value="1X2">1X2</option>
                <option value="BTTS">BTTS</option>
                <option value="Over/Under">Over/Under</option>
                <option value="Combo">Combo</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-500 ml-2" />
              <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none pr-4 cursor-pointer">
                <option value="">All Risk</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
              <Lock className="w-3.5 h-3.5 text-gray-500 ml-2" />
              <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none pr-4 cursor-pointer">
                <option value="">All Access</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>

        {/* Picks List */}
        <div className="grid grid-cols-1 gap-4">
          {picks?.map((pick: any) => (
            <Card key={pick.id} className="bg-card border-white/5 hover:border-white/10 transition-all group overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8">
                {/* Match & Team Info */}
                <div className="flex flex-col md:flex-row items-center gap-8 flex-1 w-full">
                  <div className="flex flex-col items-center gap-1 min-w-[120px]">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{pick.match?.league?.name}</span>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-600 font-bold uppercase tracking-tight">
                      <Clock className="w-3 h-3" />
                      {new Date(pick.match?.kickoff_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white uppercase italic tracking-tight">{pick.match?.home_team?.name} v {pick.match?.away_team?.name}</span>
                      {pick.premium_only && <Badge variant="primary" className="text-[8px] font-black uppercase tracking-widest h-4 px-1.5 bg-primary/20">PREMIUM</Badge>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-primary uppercase tracking-tighter">{pick.display_label}</span>
                      <span className="text-xs font-black text-gray-500">@{pick.odds.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Stats & Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:border-l border-white/5 lg:pl-8 w-full lg:w-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Confidence</span>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-primary" />
                      <span className="text-sm font-black text-white">{pick.confidence_score}/10</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Risk Level</span>
                    <Badge 
                      variant={pick.risk_level === 'low' ? 'secondary' : pick.risk_level === 'medium' ? 'primary' : 'danger'}
                      className="text-[8px] h-5 px-2 font-black uppercase border-0 bg-opacity-10"
                    >
                      {pick.risk_level}
                    </Badge>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Status</span>
                    <Badge variant={pick.result_status === 'won' ? 'won' : pick.result_status === 'lost' ? 'lost' : 'pending'} className="text-[8px] h-5 px-2 font-black uppercase">
                      {pick.result_status}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6 w-full lg:w-auto justify-center">
                  <Link href={`/admin/picks/edit/${pick.id}`}>
                    <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-white/10 hover:bg-white/5 hover:text-primary">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-white/10 hover:bg-red-500/10 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination Placeholder */}
        <div className="flex justify-center gap-2 mt-8">
          <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white/10 opacity-50"><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-primary border-primary text-black">1</Button>
          <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white/10 hover:bg-white/5">2</Button>
          <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white/10 hover:bg-white/5"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
    </AppLayout>
  )
}
