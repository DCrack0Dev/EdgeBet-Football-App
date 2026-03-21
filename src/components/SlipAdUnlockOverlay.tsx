'use client'

import { useMemo, useState } from 'react'
import Script from 'next/script'
import { AdSenseSlot } from './AdSenseSlot'
import { Button } from './Button'
import { AlertCircle, Lock } from 'lucide-react'

type SlipAdUnlockOverlayProps = {
  slipId: string
  remainingToday: number
}

export function SlipAdUnlockOverlay({ slipId, remainingToday }: SlipAdUnlockOverlayProps) {
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM

  const canAttemptUnlock = remainingToday > 0 && adsenseEnabled && !!adsenseClient && !!adsenseSlot

  const countdownLabel = useMemo(() => {
    if (countdown === null) return null
    return `${countdown}s`
  }, [countdown])

  const startCountdown = async () => {
    if (!canAttemptUnlock) return
    setError(null)
    setCountdown(10)
    for (let i = 9; i >= 0; i--) {
      await new Promise((r) => setTimeout(r, 1000))
      setCountdown(i)
    }
  }

  const confirmUnlock = async () => {
    if (!canAttemptUnlock) return
    if (countdown !== 0) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/slips/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slipId }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to unlock slip')
      }

      window.location.reload()
    } catch (e: any) {
      setError(e?.message || 'Failed to unlock slip')
      setLoading(false)
    }
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-xl rounded-[32px] border border-white/10 bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-black uppercase tracking-widest text-white">Watch Ad To Unlock</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Free users: 1 slip unlock per day
            </div>
          </div>
        </div>

        {remainingToday <= 0 && (
          <div className="mb-6 p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-500 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Daily unlock limit reached
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {adsenseEnabled && adsenseClient && adsenseSlot ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            <AdSenseSlot slot={adsenseSlot} />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
            Ads are not enabled
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-2xl font-black text-[10px] tracking-widest uppercase flex-1"
            disabled={!canAttemptUnlock || loading || countdown !== null}
            onClick={startCountdown}
          >
            {countdownLabel ? `Please Wait ${countdownLabel}` : 'Start Ad Timer'}
          </Button>
          <Button
            variant="primary"
            className="h-12 rounded-2xl font-black text-[10px] tracking-widest uppercase flex-1"
            disabled={!canAttemptUnlock || loading || countdown !== 0}
            onClick={confirmUnlock}
          >
            Unlock Slip
          </Button>
        </div>
      </div>
    </div>
  )
}

