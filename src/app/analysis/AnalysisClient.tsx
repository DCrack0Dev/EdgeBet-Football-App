'use client'

import { useState, useMemo } from 'react'
import { Badge, Card, CardHeader, CardContent } from '@/components/Card'
import { Button, cn } from '@/components/Button'
import { 
  Trophy, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Goal, 
  Activity, 
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface AnalysisClientProps {
  initialMatches: any[]
}

export function AnalysisClient({ initialMatches }: AnalysisClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [leagueFilter, setLeagueFilter] = useState('all')

  const leagues = useMemo(() => {
    const unique = new Set(initialMatches.map(m => m.league?.name).filter(Boolean))
    return ['all', ...Array.from(unique)]
  }, [initialMatches])

  const filteredMatches = useMemo(() => {
    return initialMatches.filter(match => {
      const matchesSearch = match.home_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          match.away_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          match.league?.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLeague = leagueFilter === 'all' || match.league?.name === leagueFilter

      return matchesSearch && matchesLeague
    })
  }, [initialMatches, searchQuery, leagueFilter])

  return (
    <div className="space-y-10">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Filter matches, teams or leagues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
            <Filter className="w-3.5 h-3.5 text-gray-500 ml-2" />
            <select 
              value={leagueFilter}
              onChange={(e) => setLeagueFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none pr-4 cursor-pointer"
            >
              {leagues.map(league => (
                <option key={league} value={league}>{league === 'all' ? 'All Leagues' : league}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredMatches.map((match) => (
          <Card key={match.id} className="bg-card border-white/5 overflow-hidden group hover:border-primary/20 transition-all duration-300">
            <CardHeader className="p-8 pb-0">
              <div className="flex justify-between items-start mb-6">
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/10">
                  {match.league?.name}
                </Badge>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(match.kickoff_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  <span className="text-gray-700 mx-1">•</span>
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(match.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-8 mb-8">
                <div className="flex flex-col items-center gap-4 flex-1">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                    <Trophy className="w-10 h-10 text-gray-600" />
                  </div>
                  <span className="text-lg font-black text-white text-center leading-tight uppercase italic">{match.home_team?.name}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-black text-gray-800 italic uppercase">VS</span>
                  {match.premium_analysis && <Badge variant="primary" className="text-[8px] font-black uppercase bg-primary/10 border-primary/20 text-primary">PREMIUM</Badge>}
                </div>
                <div className="flex flex-col items-center gap-4 flex-1">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                    <Trophy className="w-10 h-10 text-gray-600" />
                  </div>
                  <span className="text-lg font-black text-white text-center leading-tight uppercase italic">{match.away_team?.name}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 pt-0">
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { label: 'BTTS Trend', value: 'High (80%)', icon: Flame, color: 'text-orange-500' },
                  { label: 'Avg Goals', value: '2.8 / Match', icon: Goal, color: 'text-primary' },
                  { label: 'H2H Adv', value: 'Home Team', icon: ShieldCheck, color: 'text-green-500' },
                  { label: 'Momentum', value: 'Balanced', icon: Activity, color: 'text-blue-500' },
                ].map((trend, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <trend.icon className={cn("w-4 h-4", trend.color)} />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{trend.label}</span>
                      <span className="text-xs font-black text-white uppercase">{trend.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <div className="p-6 bg-white/5 rounded-[24px] border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Suggested Edge</span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed italic line-clamp-2">
                    {match.analysis_summary || "Statistical models favor a high-scoring encounter. Home team's offensive efficiency is up 12%."}
                  </p>
                </div>

                <Link href={`/analysis/${match.id}`} className="block">
                  <Button variant="primary" className="w-full h-14 font-black text-[10px] tracking-[0.2em] uppercase shadow-lg shadow-primary/10">
                    FULL TECHNICAL ANALYSIS <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredMatches.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white/5 rounded-[40px] border-2 border-dashed border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">No analysis found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">Try searching for a different team or league.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const ArrowRight = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)
