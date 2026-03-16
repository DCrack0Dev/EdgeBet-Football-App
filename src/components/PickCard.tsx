import { Pick, cn } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, Badge } from './Card'
import { Lock, ShieldCheck, Target, Zap, Clock, ChevronRight } from 'lucide-react'
import { Button } from './Button'
import Link from 'next/link'

interface PickCardProps {
  pick: Pick
  isLocked?: boolean
}

export function PickCard({ pick, isLocked = false }: PickCardProps) {
  const { match, display_label, odds, confidence_score, risk_level, analyst_reason, result_status } = pick

  if (isLocked) {
    return (
      <Card className="relative overflow-hidden group border-white/5 bg-card">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
          <Lock className="w-10 h-10 text-primary mb-3" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Premium Pick</h3>
          <p className="text-gray-500 mb-4 max-w-[180px] text-[11px] font-medium leading-relaxed">Unlock this expert selection with our Premium plan.</p>
          <Link href="/subscription">
            <Button variant="primary" className="h-9 px-6 font-black tracking-widest text-[9px]">UPGRADE</Button>
          </Link>
        </div>
        <CardHeader className="opacity-20 blur-sm">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="text-[9px] font-black uppercase">{match?.league?.name}</Badge>
            <Badge variant="primary" className="text-[9px] font-black uppercase">PREMIUM</Badge>
          </div>
          <CardTitle className="mt-3 text-lg font-black">{match?.home_team?.name} v {match?.away_team?.name}</CardTitle>
        </CardHeader>
        <CardContent className="opacity-20 blur-sm">
          <div className="flex justify-between items-center">
            <span className="text-xl font-black text-primary">?.??</span>
            <Badge variant="outline" className="text-[9px] font-black uppercase">Confidence: ?/10</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group border-white/5 bg-card hover:border-primary/20 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-1.5">
            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white/5 border-white/10">{match?.league?.name}</Badge>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
              <Clock className="w-3 h-3" />
              {match?.kickoff_time ? new Date(match.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              <span className="text-gray-700">•</span>
              {match?.kickoff_time ? new Date(match.kickoff_time).toLocaleDateString([], { day: 'numeric', month: 'short' }) : ''}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {pick.premium_only && <Badge variant="primary" className="text-[9px] font-black uppercase tracking-widest">PREMIUM</Badge>}
            {result_status !== 'pending' && (
              <Badge variant={result_status === 'won' ? 'won' : 'lost'} className="text-[9px] font-black uppercase tracking-widest">
                {result_status?.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="mt-2 text-xl font-black tracking-tight group-hover:text-primary transition-colors">
          {match?.home_team?.name} <span className="text-gray-600 font-medium italic">v</span> {match?.away_team?.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-end bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Market Selection</span>
            <span className="text-base font-black text-white uppercase tracking-tight leading-tight">{display_label}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Odds</span>
            <span className="text-3xl font-black text-primary tracking-tighter">@{odds?.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Confidence</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    i < Math.round((confidence_score || 0) / 2) ? "bg-primary" : "bg-white/10"
                  )} 
                />
              ))}
              <span className="text-[10px] font-black text-white ml-1">{confidence_score}/10</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Risk Level</span>
            <Badge 
              variant={risk_level === 'low' ? 'secondary' : risk_level === 'medium' ? 'primary' : 'danger'}
              className="bg-opacity-10 text-[9px] font-black tracking-widest h-6 px-3 uppercase border-0"
            >
              {risk_level?.toUpperCase()}
            </Badge>
          </div>
        </div>

        {analyst_reason && (
          <div className="relative p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
            <div className="absolute -top-2 left-4 px-2 bg-background text-[8px] font-black text-primary uppercase tracking-[0.2em]">Analyst Note</div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium italic">
              "{analyst_reason}"
            </p>
          </div>
        )}

        <Link href={`/analysis/${match?.id}`} className="block">
          <Button variant="ghost" className="w-full h-10 text-[9px] font-black tracking-[0.2em] uppercase text-gray-500 hover:text-primary hover:bg-white/5">
            View Match Analysis <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
