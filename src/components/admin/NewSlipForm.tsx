'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Button, cn } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'

export default function NewSlipForm({ picks }: { picks: any[] }) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('safe')
  const [isPremium, setIsPremium] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [selectedPickIds, setSelectedPickIds] = useState<string[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
  const router = useRouter()

  const togglePick = (id: string) => {
    setSelectedPickIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPickIds.length === 0) return alert('Select at least one pick')
    setLoading(true)

    // Calculate total odds
    const selectedPicks = picks.filter(p => selectedPickIds.includes(p.id))
    const totalOdds = selectedPicks.reduce((acc, p) => acc * Number(p.odds), 1)

    // Insert slip
    const { data: slip, error: slipError } = await supabase.from('slips').insert({
      title,
      description,
      type: type as any,
      is_premium: isPremium,
      is_published: isPublished,
      total_odds: totalOdds,
      status: 'pending'
    }).select().single()

    if (slipError) {
      alert(slipError.message)
      setLoading(false)
      return
    }

    // Insert slip items
    const slipItems = selectedPickIds.map(id => ({
      slip_id: slip.id,
      pick_id: id
    }))

    const { error: itemsError } = await supabase.from('slip_items').insert(slipItems)

    if (itemsError) {
      alert(itemsError.message)
    } else {
      router.push('/admin/slips')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Betting Slip</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Slip Title</label>
              <input 
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Daily Safe Slip"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Type</label>
              <select 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="safe">Safe</option>
                <option value="balanced">Balanced</option>
                <option value="aggressive">Aggressive</option>
                <option value="combo">Combo</option>
              </select>
            </div>
          </div>

          <div className="flex gap-8 py-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
              />
              <span className="text-sm font-medium text-gray-400">Premium Slip</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <span className="text-sm font-medium text-gray-400">Published (Visible to Users)</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Description</label>
            <textarea 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white h-24 placeholder:text-gray-600"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief summary of why this slip was created..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-400">Select Picks ({selectedPickIds.length})</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
              {picks.map(pick => (
                <div 
                  key={pick.id}
                  onClick={() => togglePick(pick.id)}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer flex justify-between items-center",
                    selectedPickIds.includes(pick.id)
                      ? "bg-primary/10 border-primary"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-tight">
                      {pick.match?.home_team?.name} vs {pick.match?.away_team?.name}
                    </span>
                    <span className="text-[10px] text-primary mt-1 uppercase">{pick.display_label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-400">{pick.odds.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Create Slip
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
