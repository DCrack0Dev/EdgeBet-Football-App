'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-black/40 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                <Zap className="w-5 h-5 text-black fill-current" />
              </div>
              <span className="font-bold text-xl tracking-tight uppercase transition-colors">EdgeBet <span className="text-primary group-hover:text-primary-light transition-colors">Football</span></span>
            </Link>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed font-medium">
              Professional football betting insights platform providing high-quality daily slips, in-depth analysis, and data-driven combo picks.
            </p>
          </div>
          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-gray-400">Platform</h5>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link href="/slips" className="hover:text-primary transition-colors">Daily Slips</Link></li>
              <li><Link href="/analysis" className="hover:text-primary transition-colors">Match Analysis</Link></li>
              <li><Link href="/history" className="hover:text-primary transition-colors">Results History</Link></li>
              <li><Link href="/subscription" className="hover:text-primary transition-colors">Pricing Plans</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-gray-400">Legal</h5>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/responsible-gambling" className="hover:text-white transition-colors">Responsible Gambling</Link></li>
              <li><Link href="/18-plus" className="hover:text-white transition-colors">18+ Notice</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 space-y-8">
          <div className="max-w-4xl">
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase tracking-wider">
              <span className="text-gray-400 font-black">Trust & Responsibility:</span> EdgeBet Football is an independent sports information service. We do not accept bets or provide gambling services. 
              Our analysis is based on historical data and expert modeling, but sports outcomes are inherently unpredictable. 
              Betting involves significant risk of loss. Never bet more than you can afford to lose. 
              If you or someone you know has a gambling problem, please seek help immediately via our <Link href="/responsible-gambling" className="text-primary hover:underline font-black">Responsible Gambling</Link> resources.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center text-[10px] font-black text-gray-500">18+</span>
                <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest italic">Play Responsibly</span>
              </div>
              <p className="text-[10px] text-gray-700 font-medium uppercase tracking-widest">
                Results are not guaranteed.
              </p>
            </div>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
              © {new Date().getFullYear()} EDGEBET FOOTBALL. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
