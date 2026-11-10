'use client'

import { useState } from 'react'
import { BrainCircuit, RefreshCw, ShieldCheck, TrendingUp } from 'lucide-react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

type Props = {
  matchId: string
  homeName: string
  awayName: string
  initialSummary?: string | null
}

function readAnalysis(summary?: string | null) {
  if (!summary) return null
  try {
    const parsed = JSON.parse(summary)
    return parsed.analysis || null
  } catch {
    return null
  }
}

export default function MatchAnalysisCard({ matchId, homeName, awayName, initialSummary }: Props) {
  const [analysis, setAnalysis] = useState<any>(() => readAnalysis(initialSummary))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyze = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/analyze-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Unable to analyze match.')
      setAnalysis(payload.analysis)
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : 'Unable to analyze match.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-4 border-primary/20 bg-primary/[0.03] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
            <BrainCircuit className="h-4 w-4" /> Explainable Match Analysis
          </div>
          <p className="mt-1 text-xs text-gray-500">Form, H2H, player availability and news for {homeName} v {awayName}.</p>
        </div>
        <Button type="button" variant="outline" onClick={analyze} isLoading={loading} className="h-9 shrink-0 gap-2 px-3 text-[9px] font-black uppercase tracking-widest">
          {!loading && (analysis ? <RefreshCw className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />)}
          {analysis ? 'Refresh Analysis' : 'Analyze Match'}
        </Button>
      </div>

      {error && <p className="mt-3 text-xs font-bold text-red-400">{error}</p>}

      {analysis && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-400 sm:grid-cols-6">
            <span>Form: {analysis.factors.form.homePoints}–{analysis.factors.form.awayPoints} pts</span>
            <span>H2H: {analysis.factors.h2h.homeWins}–{analysis.factors.h2h.draws}–{analysis.factors.h2h.awayWins}</span>
            <span>Goals: {analysis.factors.goals.expectedTotal}</span>
            <span>Unavailable: {analysis.factors.playerAvailability.homeUnavailable + analysis.factors.playerAvailability.awayUnavailable}</span>
            <span>Players: {analysis.factors.players.home.averageRating || '—'} / {analysis.factors.players.away.averageRating || '—'}</span>
            <span>News: {analysis.factors.news.articles} articles</span>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {analysis.recommendations.map((recommendation: any) => (
              <div key={`${recommendation.rank}-${recommendation.selection}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">#{recommendation.rank} {recommendation.market}</span>
                  <span className="text-[10px] font-black text-primary">{recommendation.probability}%</span>
                </div>
                <p className="mt-2 text-sm font-black uppercase italic text-white">{recommendation.selection}</p>
                <div className="mt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                  <ShieldCheck className="h-3 w-3 text-green-500" /> {recommendation.risk} risk · {recommendation.confidence}/10
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-gray-500">{recommendation.rationale[0]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
