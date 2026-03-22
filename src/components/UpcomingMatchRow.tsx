'use client'

import { Card } from '@/components/Card'
import { Match, cn } from '@/lib/supabase'
import { createBrowserClient } from '@supabase/ssr'
import { Calendar, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface UpcomingMatchRowProps {
  match: Match;
  className?: string;
}

export function UpcomingMatchRow({ match, className }: UpcomingMatchRowProps) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
  const kickoff = new Date(match.kickoff_time)
  const isToday = kickoff.toDateString() === new Date().toDateString()
  
  return (
    <Link 
      href={`/analysis/${match.id}`}
      className={cn(
        "group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-primary/20 transition-all",
        className
      )}
    >
      <div className="flex items-center gap-6 flex-1">
        {/* Teams */}
        <div className="flex flex-col gap-2 min-w-[140px]">
          <div className="flex items-center gap-2">
            {match.home_team?.logo_url ? (
              <img src={match.home_team.logo_url} alt="" className="w-5 h-5 object-contain" />
            ) : (
              <div className="w-5 h-5 bg-white/5 rounded-full flex-shrink-0" />
            )}
            <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">{match.home_team?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {match.away_team?.logo_url ? (
              <img src={match.away_team.logo_url} alt="" className="w-5 h-5 object-contain" />
            ) : (
              <div className="w-5 h-5 bg-white/5 rounded-full flex-shrink-0" />
            )}
            <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">{match.away_team?.name}</span>
          </div>
        </div>

        {/* League & Time */}
        <div className="hidden md:flex flex-col items-center justify-center px-4 border-l border-white/5 h-10">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.1em]">{match.league?.name}</span>
          <div className="flex items-center gap-1 mt-1">
            {isToday ? (
              <span className="text-[10px] font-black text-primary uppercase">TODAY</span>
            ) : (
              <span className="text-[10px] font-black text-gray-400 uppercase">{kickoff.toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
            )}
            <span className="text-[10px] font-black text-gray-400">•</span>
            <span className="text-[10px] font-black text-gray-400">{kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Scheduled</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
      </div>
    </Link>
  )
}
