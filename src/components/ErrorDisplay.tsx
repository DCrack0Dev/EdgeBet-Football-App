'use client'

import { AlertCircle, RefreshCw, Home, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/Button'
import Link from 'next/link'

interface ErrorDisplayProps {
  error?: Error & { digest?: string }
  reset?: () => void
  title?: string
  message?: string
}

export default function ErrorDisplay({ 
  error, 
  reset, 
  title = "Something went wrong", 
  message = "We encountered an unexpected error. Our team has been notified." 
}: ErrorDisplayProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-red-500/10 rounded-[32px] flex items-center justify-center mb-8 border border-red-500/20">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none">
        {title}
      </h1>
      
      <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
        {error?.message || message}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {reset && (
          <Button 
            onClick={reset}
            variant="primary" 
            className="px-8 h-12 font-black tracking-widest text-[10px] uppercase gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
        )}
        
        <Link href="/dashboard">
          <Button 
            variant="outline" 
            className="px-8 h-12 border-white/10 font-black tracking-widest text-[10px] uppercase gap-2"
          >
            <Home className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {error?.digest && (
        <p className="mt-12 text-[10px] font-black text-gray-800 uppercase tracking-widest">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  )
}
