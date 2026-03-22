'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'

export default function NewMatchForm({ leagues, teams }: { leagues: any[], teams: any[] }) {
  const [loading, setLoading] = useState(false)
  const [leagueId, setLeagueId] = useState('')
  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [kickoffTime, setKickoffTime] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [premiumAnalysis, setPremiumAnalysis] = useState(true)
  const [analysisSummary, setAnalysisSummary] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!leagueId) {
      alert('Please select a league')
      setLoading(false)
      return
    }

    if (!homeTeamId || !awayTeamId) {
      alert('Please select both home and away teams')
      setLoading(false)
      return
    }

    if (homeTeamId === awayTeamId) {
      alert('Home and away teams must be different')
      setLoading(false)
      return
    }

    const supabase = createClientComponentClient()

    const { error } = await supabase.from('matches').insert({
      league_id: leagueId,
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      kickoff_time: kickoffTime,
      status: 'scheduled' as any,
      is_featured: isFeatured,
      premium_analysis: premiumAnalysis,
      analysis_summary: analysisSummary
    })

    if (error) {
      alert(error.message)
    } else {
      window.location.href = '/admin/matches?created=1'
    }
    setLoading(false)
  }

  const filteredTeams = teams.filter(t => t.league_id === leagueId)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Match</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">League</label>
            <select 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
            >
              <option value="">Select League</option>
              {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Home Team</label>
              <select 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                value={homeTeamId}
                onChange={(e) => setHomeTeamId(e.target.value)}
              >
                <option value="">Select Home Team</option>
                {filteredTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Away Team</label>
              <select 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                value={awayTeamId}
                onChange={(e) => setAwayTeamId(e.target.value)}
              >
                <option value="">Select Away Team</option>
                {filteredTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Kickoff Time</label>
            <input 
              type="datetime-local"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
              value={kickoffTime}
              onChange={(e) => setKickoffTime(e.target.value)}
            />
          </div>

          <div className="flex gap-8 py-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <span className="text-sm font-medium text-gray-400">Featured Match</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20"
                checked={premiumAnalysis}
                onChange={(e) => setPremiumAnalysis(e.target.checked)}
              />
              <span className="text-sm font-medium text-gray-400">Premium Analysis Only</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Analysis Summary</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white h-32 placeholder:text-gray-600"
              placeholder="Provide technical analysis and tactical insights..."
              value={analysisSummary}
              onChange={(e) => setAnalysisSummary(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Create Match
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
