'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from './Button'

export function PublicNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 w-auto max-w-full overflow-x-clip z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto min-w-0 px-4 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
            <Zap className="w-5 h-5 text-black fill-current" />
          </div>
          <span className="truncate font-bold text-xl tracking-tight transition-colors">EdgeBet <span className="text-primary group-hover:text-primary-light transition-colors">Football</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="/slips">Daily Slips</Link>
          <Link className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="/analysis">Analysis</Link>
          <Link className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="/history">Results</Link>
        </nav>
        <div className="flex shrink-0 items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Login</Link>
          <Link href="/subscription">
            <Button variant="primary" size="sm" className="hidden sm:flex font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]">GET THE EDGE</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
