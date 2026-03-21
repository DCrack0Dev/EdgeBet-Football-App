import { createServerClient } from '@/lib/supabase-server'
import { AppLayout } from '@/components/AppLayout'
import { Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award, 
  Zap, 
  ShieldCheck, 
  Flame,
  Search,
  ArrowRight,
  LineChart,
  BarChart3,
  Goal,
  Activity,
  Calendar,
  Filter,
  History,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock3
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/supabase'
import { ResultsClient } from './ResultsClient'
import { Metadata } from 'next'
import { calculatePerformance } from '@/lib/utils/calculations'

export const metadata: Metadata = {
  title: "Results History",
  description: "Track our past performance and audit every betting slip outcome.",
}

export default async function ResultsHistoryPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', session?.user?.id)
    .single()

  // Fetch all settled picks for accurate stats
  const { data: allPicks } = await supabase
    .from('picks')
    .select('result_status, odds, created_at')
    .neq('result_status', 'pending')

  const perf = calculatePerformance(allPicks || [])

  // Fetch past slips (resolved only)
  const { data: pastSlips } = await supabase
    .from('slips')
    .select('*, items:slip_items(pick:picks(*, match:matches(*, home_team:teams(*), away_team:teams(*))))')
    .neq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <AppLayout profile={profile}>
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none uppercase italic">Results History</h1>
            <p className="text-gray-400 font-medium text-lg max-w-2xl leading-relaxed">
              Track our expert performance and audit every selection.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 px-6 border-white/10 gap-2 font-black text-[10px] tracking-widest uppercase">
              <Calendar className="w-4 h-4" /> Export Audit
            </Button>
          </div>
        </div>
      </header>

      {/* Performance Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Hit Rate', value: `${perf.hitRate}%`, icon: Target, color: 'text-green-500' },
          { label: 'Total Won', value: perf.winCount, icon: CheckCircle2, color: 'text-primary' },
          { label: 'Total Lost', value: perf.lossCount, icon: XCircle, color: 'text-red-500' },
          { label: 'ROI (All Time)', value: `${Number(perf.roi) > 0 ? '+' : ''}${perf.roi}%`, icon: TrendingUp, color: 'text-secondary' },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/5 border-white/5 p-6 md:p-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</span>
              <div className="flex items-center gap-4 mt-2">
                <div className={cn("p-2 rounded-xl bg-white/5", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-white tracking-tighter">{stat.value}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ResultsClient initialSlips={pastSlips || []} />
    </AppLayout>
  )
}

const ChevronRight = (props: any) => (
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
    <path d="m9 18 6-6-6-6" />
  </svg>
)
