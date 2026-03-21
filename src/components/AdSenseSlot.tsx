'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type AdSenseSlotProps = {
  className?: string
  slot: string
}

export function AdSenseSlot({ className, slot }: AdSenseSlotProps) {
  const hasPushedRef = useRef(false)
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  useEffect(() => {
    if (!client || !slot) return
    if (hasPushedRef.current) return

    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      hasPushedRef.current = true
    } catch {
    }
  }, [client, slot])

  if (!client || !slot) return null

  return (
    <ins
      className={['adsbygoogle', className].filter(Boolean).join(' ')}
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
