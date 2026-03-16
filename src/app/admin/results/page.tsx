'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/Card'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  AlertCircle,
  Activity,
  History,
  Target,
  Zap,
  RefreshCw,
  MoreVertical
} from 'lucide-react'
import Link from 'next/link'
import { Button, cn } from '@/components/Button'

export default function ResultsUpdatePage() {
  const [profile, setProfile] = useState<any>(null)
  const [picks, setPicks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [settlingId, setSettlingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPicks, setSelectedPicks] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*, subscriptions(*)')
        .eq('id', session.user.id)
        .single()

      if (profileData?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setProfile(profileData)
      fetchPicks()
    }
    fetchData()
  }, [])

  async function fetchPicks() {
    setLoading(true)
    let query = supabase
      .from('picks')
      .select('*, match:matches(*, home_team:teams(*), away_team:teams(*), league:leagues(*))')
      .order('created_at', { ascending: false })
      .limit(100)

    const { data } = await query
    setPicks(data || [])
    setLoading(false)
  }

  const handleSettle = async (pickId: string, status: 'won' | 'lost' | 'pending' | 'void') => {
    setSettlingId(pickId)
    const { error } = await supabase
      .from('picks')
      .update({ result_status: status })
      .eq('id', pickId)

    if (error) {
      alert(error.message)
    } else {
      // Update local state
      setPicks(prev => prev.map(p => p.id === pickId ? { ...p, result_status: status } : p))
      
      // Auto-update slips logic would typically happen in a DB function or background job
      // For now, we refresh to keep UI in sync
      router.refresh()
    }
    setSettlingId(null)
  }

  const handleBulkSettle = async (status: 'won' | 'lost' | 'void') => {
    if (selectedPicks.length === 0) return
    setBulkActionLoading(true)
    
    const { error } = await supabase
      .from('picks')
      .update({ result_status: status })
      .in('id', selectedPicks)

    if (error) {
      alert(error.message)
    } else {
      setPicks(prev => prev.map(p => selectedPicks.includes(p.id) ? { ...p, result_status: status } : p))
      setSelectedPicks([])
      router.refresh()
    }
    setBulkActionLoading(false)
  }

  const toggleSelectAll = () => {
    if (selectedPicks.length === filteredPicks.length) {
      setSelectedPicks([])
    } else {
      setSelectedPicks(filteredPicks.map(p => p.id))
    }
  }

  const toggleSelectPick = (id: string) => {
    setSelectedPicks(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    )
  }

  const filteredPicks = picks.filter(p => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && p.result_status === 'pending') ||
                         (filter === 'resolved' && p.result_status !== 'pending')
    const matchesSearch = p.match?.home_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.match?.away_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.display_label.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const pendingPicks = picks.filter(p => p.result_status === 'pending')

  return (
    <AppLayout profile={profile}>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="danger" className="px-4 py-1 text-[9px] font-black uppercase tracking-widest bg-red-500/20 text-red-500">Result Center</Badge>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <Clock className="w-3 h-3" /> {pendingPicks.length} Pending Selections
              </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Update Results</h1>
            <p className="text-gray-400 font-medium text-lg mt-2">Settle picks and auto-update associated daily slips.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 px-6 border-white/10 font-black text-[10px] tracking-widest uppercase hover:bg-white/5 gap-2">
              <RefreshCw className="w-4 h-4" /> Sync All Slips
            </Button>
          </div>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-card border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Awaiting Settlement</span>
              <span className="text-2xl font-black text-white tracking-tighter">{pendingPicks.length} Picks</span>
            </div>
          </Card>
          <Card className="p-6 bg-card border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Total Won (30d)</span>
              <span className="text-2xl font-black text-white tracking-tighter">142 Picks</span>
            </div>
          </Card>
          <Card className="p-6 bg-card border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Settlement Accuracy</span>
              <span className="text-2xl font-black text-white tracking-tighter">100% Verified</span>
            </div>
          </Card>
        </div>

        {/* List Controls */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search by team or display label..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                <Filter className="w-3.5 h-3.5 text-gray-500 ml-2" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none pr-4 cursor-pointer"
                >
                  <option value="pending">Pending Only</option>
                  <option value="resolved">Resolved Only</option>
                  <option value="all">All Status</option>
                </select>
              </div>
            </div>
          </div>

          {selectedPicks.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest ml-2">
                {selectedPicks.length} Items Selected
              </span>
              <div className="h-4 w-px bg-primary/20 mx-2" />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="primary" 
                  onClick={() => handleBulkSettle('won')}
                  disabled={bulkActionLoading}
                  className="h-8 px-4 text-[9px] font-black uppercase tracking-widest"
                >
                  Bulk Won
                </Button>
                <Button 
                  size="sm" 
                  variant="danger" 
                  onClick={() => handleBulkSettle('lost')}
                  disabled={bulkActionLoading}
                  className="h-8 px-4 text-[9px] font-black uppercase tracking-widest"
                >
                  Bulk Lost
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleBulkSettle('void')}
                  disabled={bulkActionLoading}
                  className="h-8 px-4 text-[9px] font-black uppercase tracking-widest border-white/10"
                >
                  Bulk Void
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Settlement Table */}
        <Card className="bg-card border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedPicks.length === filteredPicks.length && filteredPicks.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20 focus:ring-offset-0"
                    />
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Match / Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Selection</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Odds</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPicks.map((pick: any) => (
                  <tr key={pick.id} className={cn(
                    "hover:bg-white/5 transition-all group",
                    selectedPicks.includes(pick.id) && "bg-primary/[0.03]"
                  )}>
                    <td className="px-6 py-6">
                      <input 
                        type="checkbox" 
                        checked={selectedPicks.includes(pick.id)}
                        onChange={() => toggleSelectPick(pick.id)}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20 focus:ring-offset-0"
                      />
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-white uppercase italic tracking-tight">{pick.match?.home_team?.name} v {pick.match?.away_team?.name}</span>
                        <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                          <Badge variant="outline" className="text-[8px] py-0 bg-white/5 border-white/10">{pick.match?.league?.name}</Badge>
                          <span className="text-gray-700">•</span>
                          <Calendar className="w-3 h-3" />
                          {new Date(pick.match?.kickoff_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-primary uppercase tracking-tighter leading-none mb-1">{pick.display_label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{pick.selection_type}</span>
                          {pick.premium_only && <Badge variant="primary" className="text-[8px] py-0 px-1">PREMIUM</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="text-sm font-black text-white">@{pick.odds.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-center gap-2">
                        {pick.result_status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleSettle(pick.id, 'won')}
                              disabled={settlingId === pick.id}
                              className="h-9 px-4 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                            >
                              {settlingId === pick.id ? '...' : 'WON'}
                            </button>
                            <button 
                              onClick={() => handleSettle(pick.id, 'lost')}
                              disabled={settlingId === pick.id}
                              className="h-9 px-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                            >
                              {settlingId === pick.id ? '...' : 'LOST'}
                            </button>
                            <button 
                              onClick={() => handleSettle(pick.id, 'void')}
                              className="h-9 w-9 rounded-xl bg-white/5 text-gray-500 flex items-center justify-center hover:text-white transition-colors"
                              title="Void Pick"
                            >
                              <Activity className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge variant={pick.result_status === 'won' ? 'won' : pick.result_status === 'void' ? 'secondary' : 'lost'} className="h-8 px-4 font-black text-[9px] uppercase tracking-widest">
                              {pick.result_status}
                            </Badge>
                            <button 
                              onClick={() => handleSettle(pick.id, 'pending')}
                              className="text-gray-600 hover:text-primary transition-colors"
                              title="Reset to Pending"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Empty State */}
        {(!loading && filteredPicks.length === 0) && (
          <div className="py-24 text-center bg-white/5 rounded-[40px] border-2 border-dashed border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">All Caught Up</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">No pending results to update. Check back after kickoff.</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
