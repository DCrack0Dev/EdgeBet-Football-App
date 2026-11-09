'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, RefreshCw } from 'lucide-react'
import { Button } from '@/components/Button'

function today() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export default function FixtureSyncControls() {
  const router = useRouter()
  const [date, setDate] = useState(today)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const syncFixtures = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/admin/sync-fixtures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Unable to sync fixtures.')
      }

      setMessage(result.message)
      router.refresh()
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : 'Unable to sync fixtures.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full md:w-auto space-y-2">
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <label className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <Calendar className="h-4 w-4 shrink-0 text-gray-500" />
          <span className="sr-only">Fixture date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="min-w-0 w-full bg-transparent text-xs font-black uppercase tracking-widest text-gray-300 outline-none"
          />
        </label>
        <Button
          type="button"
          variant="primary"
          onClick={syncFixtures}
          isLoading={loading}
          className="h-11 shrink-0 px-4 font-black text-[10px] tracking-widest uppercase gap-2"
        >
          {!loading && <RefreshCw className="h-4 w-4" />}
          Sync Fixtures
        </Button>
      </div>
      {message && <p className="text-right text-xs font-bold text-green-500">{message}</p>}
      {error && <p className="max-w-sm text-right text-xs font-bold text-red-400">{error}</p>}
    </div>
  )
}
