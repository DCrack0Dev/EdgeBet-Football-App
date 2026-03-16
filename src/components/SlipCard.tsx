import { Slip, Pick, cn } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, Badge } from './Card'
import { Lock, ChevronRight, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from './Button'
import Link from 'next/link'

interface SlipCardProps {
  slip: Slip
  isLocked?: boolean
}

export function SlipCard({ slip, isLocked = false }: SlipCardProps) {
  const { title, description, type, is_premium, total_odds, status, items: rawItems } = slip
  const items = rawItems?.map((item: any) => item.pick || item)

  if (isLocked) {
    return (
      <Card className="relative overflow-hidden group border-white/5 bg-card">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 border border-primary/30">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Premium Slip</h3>
          <p className="text-gray-400 mb-6 max-w-[200px] text-sm font-medium">Get all our expert selections and boost your winnings.</p>
          <Link href="/subscription">
            <Button variant="primary" className="px-8 h-11 font-black tracking-widest text-[10px]">UNLOCK SLIP</Button>
          </Link>
        </div>
        <CardHeader className="opacity-20 blur-sm">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="text-[10px] font-black uppercase">{type?.toUpperCase()}</Badge>
            <Badge variant="primary" className="text-[10px] font-black uppercase">PREMIUM</Badge>
          </div>
          <CardTitle className="mt-4 text-2xl font-black">{title}</CardTitle>
        </CardHeader>
        <CardContent className="opacity-20 blur-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-black text-primary">?.?? Odds</span>
            <Badge variant="outline">Selections: ?</Badge>
          </div>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-12 w-full bg-white/5 rounded-xl border border-white/5" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full border-l-4 border-l-primary/50 group hover:border-l-primary transition-all duration-300 border-white/5 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge 
            variant={type === 'safe' ? 'secondary' : type === 'balanced' ? 'primary' : 'danger'}
            className="bg-opacity-10 text-[10px] font-black tracking-widest"
          >
            {type?.toUpperCase()}
          </Badge>
          <div className="flex gap-2">
            {is_premium && <Badge variant="primary" className="text-[10px] font-black tracking-widest">PREMIUM</Badge>}
            {status !== 'pending' && <Badge variant={status === 'won' ? 'won' : 'lost'} className="text-[10px] font-black tracking-widest">{status?.toUpperCase()}</Badge>}
          </div>
        </div>
        <CardTitle className="mt-4 text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{title}</CardTitle>
        {description && <p className="text-sm text-gray-400 mt-2 font-medium line-clamp-2">{description}</p>}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Combined Odds</span>
            <span className="text-3xl font-black text-primary tracking-tighter">{total_odds?.toFixed(2)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Selections</span>
            <span className="text-3xl font-black text-white tracking-tighter">{items?.length || 0}</span>
          </div>
        </div>
        
        <div className="space-y-3 flex-1">
          {items?.slice(0, 3).map((item, index) => (
            <div key={item.id} className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border border-white/5 group/item hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Pick #{index + 1}</span>
                {item.result_status !== 'pending' && (
                  item.result_status === 'won' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white leading-tight">
                    {item.match?.home_team?.name} v {item.match?.away_team?.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-primary font-black uppercase tracking-tight">{item.display_label}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-gray-400">@{item.odds?.toFixed(2)}</span>
              </div>
            </div>
          ))}
          {items && items.length > 3 && (
            <p className="text-[10px] text-gray-500 text-center font-bold uppercase tracking-widest pt-2">
              + {items.length - 3} more selections
            </p>
          )}
        </div>

        <Link href={`/slips/${slip.id}`} className="mt-6">
          <Button variant="outline" className="w-full h-12 font-black text-[10px] tracking-[0.2em] uppercase border-white/10 hover:bg-primary hover:text-black hover:border-primary group/btn">
            View Details <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
