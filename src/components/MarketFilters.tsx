'use client'

import { cn } from '@/lib/supabase'
import { 
  Trophy, 
  Target, 
  Zap, 
  ShieldCheck, 
  Flame,
  LayoutGrid
} from 'lucide-react'

const MARKETS = [
  { id: 'all', name: 'All Markets', icon: LayoutGrid },
  { id: '1x2', name: 'Match Result', icon: Trophy },
  { id: 'btts', name: 'BTTS', icon: Flame },
  { id: 'overunder', name: 'Over/Under', icon: Target },
  { id: 'double', name: 'Double Chance', icon: ShieldCheck },
  { id: 'combo', name: 'Combo', icon: Zap },
]

interface MarketFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

export function MarketFilters({ activeFilter, onFilterChange, className }: MarketFiltersProps) {
  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar", className)}>
      {MARKETS.map((market) => {
        const isActive = activeFilter === market.id
        return (
          <button
            key={market.id}
            onClick={() => onFilterChange(market.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border",
              isActive 
                ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                : "bg-white/5 text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
            )}
          >
            <market.icon className={cn("w-4 h-4", isActive ? "text-black" : "text-gray-500")} />
            {market.name}
          </button>
        )
      })}
    </div>
  )
}
