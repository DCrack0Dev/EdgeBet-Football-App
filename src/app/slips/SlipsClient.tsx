'use client'

import { useState, useMemo } from 'react'
import { SlipCard } from '@/components/SlipCard'
import { PickCard } from '@/components/PickCard'
import { Badge } from '@/components/Card'
import { Filter, Calendar, Crown, Search, Zap, ShieldCheck, Target, Flame, LayoutGrid, Clock } from 'lucide-react'
import { Button, cn } from '@/components/Button'

interface SlipsClientProps {
  initialSlips: any[]
  initialPicks: any[]
  isPremium: boolean
}

export function SlipsClient({ initialSlips, initialPicks, isPremium }: SlipsClientProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [accessFilter, setAccessFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'all', label: 'All Tips', icon: LayoutGrid },
    { id: 'safe', label: 'Safe Slips', icon: ShieldCheck },
    { id: 'balanced', label: 'Balanced', icon: Zap },
    { id: 'aggressive', label: 'Aggressive', icon: Flame },
    { id: 'combo', label: 'Combo Picks', icon: Target },
    { id: 'btts', label: 'BTTS', icon: Flame },
    { id: 'overunder', label: 'Over/Under', icon: Target },
    { id: 'halftime', label: 'Half Time', icon: Clock },
  ]

  const filteredData = useMemo(() => {
    let slips = [...initialSlips]
    let picks = [...initialPicks]

    // 1. Tab Filtering
    if (activeTab !== 'all') {
      if (['safe', 'balanced', 'aggressive'].includes(activeTab)) {
        slips = slips.filter(s => s.type === activeTab)
        picks = [] // Only show slips for these tabs
      } else if (activeTab === 'combo') {
        slips = slips.filter(s => s.type === 'combo')
        picks = picks.filter(p => p.selection_type?.toLowerCase().includes('combo') || p.display_label?.toLowerCase().includes('+'))
      } else if (activeTab === 'btts') {
        slips = slips.filter(s => s.items?.some((item: any) => {
          const p = item.pick || item
          return p.selection_type?.toLowerCase().includes('btts') || p.display_label?.toLowerCase().includes('btts')
        }))
        picks = picks.filter(p => p.selection_type?.toLowerCase().includes('btts') || p.display_label?.toLowerCase().includes('btts'))
      } else if (activeTab === 'overunder') {
        slips = slips.filter(s => s.items?.some((item: any) => {
          const p = item.pick || item
          return p.selection_type?.toLowerCase().includes('over') || p.selection_type?.toLowerCase().includes('under')
        }))
        picks = picks.filter(p => p.selection_type?.toLowerCase().includes('over') || p.selection_type?.toLowerCase().includes('under'))
      } else if (activeTab === 'halftime') {
        slips = slips.filter(s => s.items?.some((item: any) => {
          const p = item.pick || item
          return p.display_label?.toLowerCase().includes('half')
        }))
        picks = picks.filter(p => p.display_label?.toLowerCase().includes('half'))
      }
    }

    // 2. Risk Filtering
    if (riskFilter !== 'all') {
      slips = slips.filter(s => {
        // Calculate average risk for slip? For now just check if any pick matches
        return s.items?.some((item: any) => {
          const p = item.pick || item
          return p.risk_level === riskFilter
        })
      })
      picks = picks.filter(p => p.risk_level === riskFilter)
    }

    // 3. Access Filtering
    if (accessFilter !== 'all') {
      const isPremiumFilter = accessFilter === 'premium'
      slips = slips.filter(s => s.is_premium === isPremiumFilter)
      picks = picks.filter(p => p.premium_only === isPremiumFilter)
    }

    // 4. Search Filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      slips = slips.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.items?.some((item: any) => {
          const p = item.pick || item
          return p.match?.home_team?.name.toLowerCase().includes(q) || 
                 p.match?.away_team?.name.toLowerCase().includes(q) ||
                 p.display_label.toLowerCase().includes(q)
        })
      )
      picks = picks.filter(p => 
        p.match?.home_team?.name.toLowerCase().includes(q) || 
        p.match?.away_team?.name.toLowerCase().includes(q) ||
        p.display_label.toLowerCase().includes(q)
      )
    }

    return { slips, picks }
  }, [activeTab, riskFilter, accessFilter, searchQuery, initialSlips, initialPicks])

  return (
    <div className="space-y-10">
      {/* Controls Area */}
      <div className="space-y-6">
        {/* Main Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map((tab) => {
            const IsActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all border shrink-0",
                  IsActive 
                    ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
                    : "bg-white/5 text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
                )}
              >
                <tab.icon className={cn("w-4 h-4", IsActive ? "text-black" : "text-gray-500")} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Secondary Filters & Search */}
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            {/* Risk Filter */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
              {['all', 'low', 'medium', 'high'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    riskFilter === risk ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  {risk}
                </button>
              ))}
            </div>

            {/* Access Filter */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
              {['all', 'free', 'premium'].map((access) => (
                <button
                  key={access}
                  onClick={() => setAccessFilter(access)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    accessFilter === access ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  {access}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full xl:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search matches or markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="space-y-12">
        {/* Slips Section */}
        {filteredData.slips.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Daily Combo Slips</h2>
              <Badge variant="outline" className="ml-2 bg-white/5 border-white/10">{filteredData.slips.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredData.slips.map((slip) => (
                <SlipCard key={slip.id} slip={slip} isLocked={slip.is_premium && !isPremium} />
              ))}
            </div>
          </section>
        )}

        {/* Picks Section */}
        {filteredData.picks.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-secondary rounded-full" />
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Individual Picks</h2>
              <Badge variant="outline" className="ml-2 bg-white/5 border-white/10">{filteredData.picks.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredData.picks.map((pick) => (
                <PickCard key={pick.id} pick={pick} isLocked={pick.premium_only && !isPremium} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredData.slips.length === 0 && filteredData.picks.length === 0 && (
          <div className="py-24 text-center bg-white/5 rounded-[40px] border-2 border-dashed border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No tips found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">We couldn't find any slips or picks matching your current filters.</p>
            <Button 
              variant="primary" 
              className="px-8 h-12 font-black tracking-widest"
              onClick={() => {
                setActiveTab('all')
                setRiskFilter('all')
                setAccessFilter('all')
                setSearchQuery('')
              }}
            >
              CLEAR ALL FILTERS
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
