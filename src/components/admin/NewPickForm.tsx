'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'

export default function NewPickForm({ matches }: { matches: any[] }) {
  const [loading, setLoading] = useState(false)
  const [matchId, setMatchId] = useState('')
  const [selectionType, setSelectionType] = useState('1X2')
  const [marketPrimary, setMarketPrimary] = useState('')
  const [marketSecondary, setMarketSecondary] = useState('')
  const [displayLabel, setDisplayLabel] = useState('')
  const [odds, setOdds] = useState('')
  const [confidence, setConfidence] = useState('7')
  const [risk, setRisk] = useState('medium')
  const [reason, setReason] = useState('')
  const [isPremium, setIsPremium] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('picks').insert({
      match_id: matchId,
      selection_type: selectionType,
      market_primary: marketPrimary,
      market_secondary: marketSecondary || null,
      display_label: displayLabel,
      odds: parseFloat(odds),
      confidence_score: parseInt(confidence),
      risk_level: risk as any,
      analyst_reason: reason,
      premium_only: isPremium,
      result_status: 'pending'
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/admin')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Pick</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Match</label>
            <select 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
            >
              <option value="">Select Match</option>
              {matches.map(m => (
                <option key={m.id} value={m.id}>
                  {m.home_team?.name} vs {m.away_team?.name} ({new Date(m.kickoff_time).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Selection Type</label>
              <select 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                value={selectionType}
                onChange={(e) => setSelectionType(e.target.value)}
              >
                <option value="1X2">1X2</option>
                <option value="Double Chance">Double Chance</option>
                <option value="BTTS">BTTS</option>
                <option value="Over/Under">Over/Under</option>
                <option value="Combo">Combo Market</option>
                <option value="Handicap">Handicap</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Display Label (e.g. Home Win + Over 1.5)</label>
              <input 
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                value={displayLabel}
                onChange={(e) => setDisplayLabel(e.target.value)}
                placeholder="Home/Draw + Over 1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Market Primary</label>
              <input 
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                value={marketPrimary}
                onChange={(e) => setMarketPrimary(e.target.value)}
                placeholder="Home/Draw"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Market Secondary (Optional)</label>
              <input 
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                value={marketSecondary}
                onChange={(e) => setMarketSecondary(e.target.value)}
                placeholder="Over 1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Odds</label>
              <input 
                type="number"
                step="0.01"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
                placeholder="1.85"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Confidence (1-10)</label>
              <input 
                type="number"
                min="1"
                max="10"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Risk Level</label>
              <select 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Analyst Reason</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white h-24"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why this pick? (visible to premium users)"
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="isPremium"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="isPremium" className="text-sm font-medium text-white cursor-pointer">Premium Only</label>
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Create Pick
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
