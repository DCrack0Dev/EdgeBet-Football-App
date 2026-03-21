import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/Card'
import { 
  Ticket, 
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
  Eye,
  EyeOff,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { Button, cn } from '@/components/Button'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ManageSlipsPage() {
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

  // Fetch all slips with their picks via junction table
  const { data: slips } = await supabase
    .from('slips')
    .select('*, items:slip_items(pick:picks(*))')
    .order('created_at', { ascending: false })

  return (
    <AppLayout profile={profile}>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Manage Slips</h1>
            <p className="text-gray-400 font-medium text-lg mt-2">Combine picks into high-value slips and manage technical gating.</p>
          </div>
          
          <Link href="/admin/slips/new">
            <Button variant="primary" className="h-12 px-8 font-black text-[10px] tracking-widest uppercase gap-2 shadow-lg shadow-primary/10">
              <Plus className="w-4 h-4" /> Create New Slip
            </Button>
          </Link>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search slips by title or description..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
              <Filter className="w-3.5 h-3.5 text-gray-500 ml-2" />
              <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none pr-4 cursor-pointer">
                <option value="">All Types</option>
                <option value="safe">Safe</option>
                <option value="balanced">Balanced</option>
                <option value="aggressive">Aggressive</option>
                <option value="combo">Combo</option>
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

        {/* Slips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {slips?.map((slip: any) => (
            <Card key={slip.id} className="bg-card border-white/5 hover:border-white/10 transition-all group flex flex-col overflow-hidden">
              <div className="p-6 md:p-8 flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1.5">
                    <Badge 
                      variant={slip.type === 'safe' ? 'secondary' : slip.type === 'balanced' ? 'primary' : 'danger'}
                      className="text-[8px] h-5 px-2 font-black uppercase border-0 bg-opacity-10"
                    >
                      {slip.type}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-600 font-bold uppercase tracking-tight">
                      <Clock className="w-3 h-3" />
                      {new Date(slip.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {slip.is_premium && <Badge variant="primary" className="text-[8px] font-black uppercase tracking-widest h-4 px-1.5 bg-primary/20">PREMIUM</Badge>}
                    <Badge variant={slip.status === 'won' ? 'won' : slip.status === 'lost' ? 'lost' : 'pending'} className="text-[8px] h-4 px-1.5 font-black uppercase">
                      {slip.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-colors">{slip.title}</h3>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2">{slip.description || 'Verified combination slip.'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Selections</span>
                    <span className="text-lg font-black text-white">{slip.items?.length || 0} {slip.items?.length === 1 ? 'Pick' : 'Picks'}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Odds</span>
                    <span className="text-lg font-black text-primary">@{slip.total_odds?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-2">
                  <button className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                    {slip.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/slips/edit/${slip.id}`}>
                    <Button variant="outline" size="sm" className="h-9 px-4 border-white/10 font-black text-[9px] uppercase tracking-widest hover:bg-white/5">
                      Edit Slip
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-white/10 hover:bg-red-500/10 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {(!slips || slips.length === 0) && (
          <div className="py-24 text-center bg-white/5 rounded-[40px] border-2 border-dashed border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
              <Ticket className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">No Slips Found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">Create your first daily combo slip to start publishing insights.</p>
            <Link href="/admin/slips/new">
              <Button variant="primary" className="px-8 h-12 font-black tracking-widest text-[10px] uppercase">Create Slip Now</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
