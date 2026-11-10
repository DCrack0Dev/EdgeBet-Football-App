'use client'

import { useState } from 'react'
import { BrainCircuit, CheckCircle2, RefreshCw, ShieldCheck, TrendingUp, X } from 'lucide-react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

type Props = {
  matchId: string
  homeName: string
  awayName: string
  initialSummary?: string | null
  availableSlips: Array<{ id: string; title: string; type: string; total_odds?: number | null }>
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

export default function MatchAnalysisCard({ matchId, homeName, awayName, initialSummary, availableSlips }: Props) {
  const [analysis, setAnalysis] = useState<any>(() => readAnalysis(initialSummary))
  const [loading, setLoading] = useState(false)
  const [publishingRank, setPublishingRank] = useState<number | null>(null)
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null)
  const [slipId, setSlipId] = useState('')
  const [newSlipTitle, setNewSlipTitle] = useState('')
  const [premiumOnly, setPremiumOnly] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const analyze = async () => {
    setLoading(true)
    setError('')
    setMessage('')
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

  const openPublish = (recommendation: any) => {
    setSelectedRecommendation(recommendation)
    setSlipId('')
    setNewSlipTitle('')
    setMessage('')
    setError('')
  }

  const publish = async () => {
    if (!selectedRecommendation || (!slipId && !newSlipTitle.trim())) {
      setError('Select an existing slip or enter a title for a new slip.')
      return
    }
    setPublishingRank(selectedRecommendation.rank)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/admin/publish-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          recommendation: selectedRecommendation,
          slipId: slipId || undefined,
          newSlipTitle: newSlipTitle || undefined,
          premiumOnly,
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Unable to publish prediction.')
      setMessage(`Published to slip. Estimated fair odds: ${payload.estimatedOdds}.`)
      setSelectedRecommendation(null)
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : 'Unable to publish prediction.')
    } finally {
      setPublishingRank(null)
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
      {message && <p className="mt-3 flex items-center gap-2 text-xs font-bold text-green-400"><CheckCircle2 className="h-4 w-4" />{message}</p>}

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
                <Button type="button" variant="primary" onClick={() => openPublish(recommendation)} className="mt-3 h-8 w-full text-[9px] font-black uppercase tracking-widest">
                  Select & Publish to Slip
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRecommendation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-card p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Publish prediction</p>
                <h3 className="mt-1 text-lg font-black uppercase italic text-white">{selectedRecommendation.selection}</h3>
                <p className="mt-1 text-xs text-gray-500">The complete pre-match rationale will be saved with the pick.</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setSelectedRecommendation(null)} className="text-gray-500 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-5 space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Add to existing slip</label>
              <select value={slipId} onChange={(event) => { setSlipId(event.target.value); setNewSlipTitle('') }} className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white">
                <option value="">Create a new slip instead</option>
                {availableSlips.map((slip) => <option key={slip.id} value={slip.id}>{slip.title} ({slip.type})</option>)}
              </select>
              {!slipId && <input value={newSlipTitle} onChange={(event) => setNewSlipTitle(event.target.value)} placeholder="New slip title" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-gray-600" />}
              <label className="flex items-center gap-3 text-xs font-bold text-gray-400"><input type="checkbox" checked={premiumOnly} onChange={(event) => setPremiumOnly(event.target.checked)} className="h-4 w-4" /> Premium pick</label>
              <p className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-gray-400">Model probability: <strong className="text-primary">{selectedRecommendation.probability}%</strong>. The system will calculate indicative fair odds for the slip.</p>
              {error && <p className="text-xs font-bold text-red-400">{error}</p>}
              <div className="flex gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setSelectedRecommendation(null)} className="flex-1">Cancel</Button><Button type="button" variant="primary" onClick={publish} isLoading={publishingRank === selectedRecommendation.rank} className="flex-1">Publish Pick</Button></div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
