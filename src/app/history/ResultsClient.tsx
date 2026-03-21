'use client'

import { useState, useMemo } from 'react'
import { Badge, Card } from '@/components/Card'
import { Button, cn } from '@/components/Button'
import { 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  History,
  LayoutGrid
} from 'lucide-react'
import Link from 'next/link'

interface ResultsClientProps {
  initialSlips: any[]
}

export function ResultsClient({ initialSlips }: ResultsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredSlips = useMemo(() => {
    return initialSlips.filter(slip => {
      const matchesSearch = slip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          slip.items?.some((item: any) => {
                            const p = item.pick || item
                            return p.match?.home_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   p.match?.away_team?.name.toLowerCase().includes(searchQuery.toLowerCase())
                          })
      const matchesStatus = statusFilter === 'all' || slip.status === statusFilter
      const matchesType = typeFilter === 'all' || slip.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [initialSlips, searchQuery, statusFilter, typeFilter])

  return (
    <div className="space-y-10">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search by title, team or match..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
            <Filter className="w-3.5 h-3.5 text-gray-500 ml-2" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none pr-4 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="won">Won Only</option>
              <option value="lost">Lost Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
            <LayoutGrid className="w-3.5 h-3.5 text-gray-500 ml-2" />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none pr-4 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="safe">Safe</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
              <option value="combo">Combo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="grid gap-6">
        {filteredSlips.map((slip) => (
          <Card key={slip.id} className="bg-card border-white/5 overflow-hidden group hover:border-primary/20 transition-all duration-300">
            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:items-center">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant={slip.status === 'won' ? 'won' : 'lost'} className="h-6 px-3 text-[9px] font-black uppercase tracking-widest">
                    {slip.status?.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(slip.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase italic group-hover:text-primary transition-colors">{slip.title}</h3>
                <p className="text-gray-500 text-sm font-medium italic">"{slip.description || 'Verified analyst combination.'}"</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:w-[480px]">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Selections</span>
                  <span className="text-xl font-black text-white">{slip.items?.length || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Odds</span>
                  <span className="text-xl font-black text-primary">@{slip.total_odds?.toFixed(2)}</span>
                </div>
                <div className="flex flex-col col-span-2 md:col-span-1">
                  <Link href={`/slips/${slip.id}`}>
                    <Button variant="outline" className="w-full h-11 text-[9px] font-black tracking-widest uppercase border-white/10 hover:bg-white/5">
                      Audit details <ChevronRight className="w-3 h-3 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Collapsible selection results preview */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
              {slip.items?.map((item: any, i: number) => {
                const p = item.pick || item
                return (
                  <div key={i} className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white uppercase tracking-tight">
                        {p.match?.home_team?.name} v {p.match?.away_team?.name}
                      </span>
                      <span className="text-[9px] text-primary font-bold uppercase">{p.display_label}</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-500">@{p.odds?.toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}

        {filteredSlips.length === 0 && (
          <div className="py-24 text-center bg-white/5 rounded-[40px] border-2 border-dashed border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">Try adjusting your filters to find the historical data you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  )
}

