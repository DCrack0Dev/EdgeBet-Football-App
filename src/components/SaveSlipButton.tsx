'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Bookmark, Check, Loader2 } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/supabase'

interface SaveSlipButtonProps {
  slipId: string
  initialIsSaved?: boolean
  className?: string
  variant?: 'outline' | 'primary' | 'ghost'
}

export function SaveSlipButton({ 
  slipId, 
  initialIsSaved = false, 
  className,
  variant = 'outline'
}: SaveSlipButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function checkStatus() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        
        // If initialIsSaved wasn't provided, check DB
        if (initialIsSaved === undefined) {
          const { data } = await supabase
            .from('saved_slips')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('slip_id', slipId)
            .single()
          setIsSaved(!!data)
        }
      }
    }
    checkStatus()
  }, [slipId, initialIsSaved])

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      // Could trigger login modal or redirect
      window.location.href = '/login'
      return
    }

    setLoading(true)
    
    try {
      if (isSaved) {
        await supabase
          .from('saved_slips')
          .delete()
          .eq('user_id', userId)
          .eq('slip_id', slipId)
        setIsSaved(false)
      } else {
        await supabase
          .from('saved_slips')
          .insert({ user_id: userId, slip_id: slipId })
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Error toggling save:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      onClick={toggleSave}
      disabled={loading}
      className={cn(
        "h-12 px-6 border-white/10 gap-2 font-black text-[10px] tracking-widest uppercase transition-all duration-300",
        isSaved && "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20",
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isSaved ? (
        <>
          <Check className="w-4 h-4" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          Save
        </>
      )}
    </Button>
  )
}
