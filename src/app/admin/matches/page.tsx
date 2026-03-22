import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/Card'
import { 
  Trophy, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Star, 
  Lock,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { Button, cn } from '@/components/Button'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ManageMatchesPage() {
  const supabase = await createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch all matches with related data
  const { data: matches } = await supabase
    .from('matches')
    .select('*, league:leagues(*), home_team:teams(*), away_team:teams(*)')
    .order('kickoff_time', { ascending: false })

  const { data: leagues } = await supabase.from('leagues').select('*').order('name')

  return (
    <AppLayout profile={profile}>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Manage Matches</h1>
            <p className="text-gray-400 font-medium text-lg mt-2">Schedule upcoming fixtures and manage technical analysis gating.</p>
          </div>
          
          <Link href="/admin/matches/new">
            <Button variant="primary" className="h-12 px-8 font-black text-[10px] tracking-widest uppercase gap-2 shadow-lg shadow-primary/10">
              <Plus className="w-4 h-4" /> Create New Match
            </Button>
          </Link>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search teams or leagues..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
              <Filter className="w-3.5 h-3.5 text-gray-500 ml-2" />
              <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none pr-4 cursor-pointer">
                <option value="">All Leagues</option>
                {leagues?.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            
            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-gray-500 ml-2" />
              <input type="date" className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none pr-2 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Matches Table/Grid */}
        <div className="grid grid-cols-1 gap-4">
          {matches?.map((match: any) => (
            <Card key={match.id} className="bg-card border-white/5 hover:border-white/10 transition-all group overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                {/* Match Identity */}
                <div className="flex flex-col md:flex-row items-center gap-8 flex-1 w-full">
                  <div className="flex flex-col items-center gap-1 min-w-[100px]">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{match.league?.name}</span>
                    <Badge variant="outline" className="text-[9px] font-black uppercase bg-white/5 border-white/10">{match.status}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 flex-1">
                    <div className="flex flex-col items-center gap-3 flex-1 text-center">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                        {match.home_team?.logo_url ? (
                          <img src={match.home_team.logo_url} alt="" className="w-2/3 h-2/3 object-contain" />
                        ) : (
                          <Trophy className="w-6 h-6 text-gray-700" />
                        )}
                      </div>
                      <span className="text-sm font-black text-white uppercase tracking-tight">{match.home_team?.name}</span>
                    </div>
                    <span className="text-2xl font-black text-gray-800 italic">VS</span>
                    <div className="flex flex-col items-center gap-3 flex-1 text-center">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                        {match.away_team?.logo_url ? (
                          <img src={match.away_team.logo_url} alt="" className="w-2/3 h-2/3 object-contain" />
                        ) : (
                          <Trophy className="w-6 h-6 text-gray-700" />
                        )}
                      </div>
                      <span className="text-sm font-black text-white uppercase tracking-tight">{match.away_team?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Configuration Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:border-l border-white/5 md:pl-8 w-full md:w-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Kickoff</span>
                    <span className="text-xs font-black text-white whitespace-nowrap">
                      {new Date(match.kickoff_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      <br />
                      {new Date(match.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Premium</span>
                    <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center border", match.premium_analysis ? "bg-primary/20 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-gray-700")}>
                      <Lock className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Featured</span>
                    <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center border", match.is_featured ? "bg-secondary/20 border-secondary/30 text-secondary" : "bg-white/5 border-white/10 text-gray-700")}>
                      <Star className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6 w-full md:w-auto justify-center">
                  <Link href={`/admin/matches/edit/${match.id}`}>
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
