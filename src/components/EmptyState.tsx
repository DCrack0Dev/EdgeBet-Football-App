'use client'

import { LucideIcon, Search } from 'lucide-react'
import { Button } from './Button'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({ 
  icon: Icon = Search, 
  title, 
  description, 
  actionLabel, 
  actionHref, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="py-24 text-center bg-white/5 rounded-[40px] border-2 border-dashed border-white/5">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-gray-600" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">{title}</h3>
      <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">{description}</p>
      
      {actionLabel && (
        <>
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="primary" className="px-8 h-12 font-black tracking-widest text-[10px] uppercase">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button 
              variant="primary" 
              className="px-8 h-12 font-black tracking-widest text-[10px] uppercase"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
