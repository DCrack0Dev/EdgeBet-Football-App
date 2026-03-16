'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MAIN_NAV_ITEMS, ADMIN_NAV_ITEMS } from '@/lib/navigation'
import { cn } from '@/lib/supabase'
import { Zap } from 'lucide-react'

interface SidebarProps {
  role?: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = role === 'admin'

  const renderNavItems = (items: typeof MAIN_NAV_ITEMS) => {
    return items.map((item) => {
      const isActive = pathname === item.href
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all rounded-xl mb-1 group',
            isActive 
              ? 'bg-primary text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          )}
        >
          <item.icon className={cn(
            'w-5 h-5 transition-colors',
            isActive ? 'text-black' : 'text-gray-500 group-hover:text-primary'
          )} />
          {item.name}
        </Link>
      )
    })
  }

  return (
    <aside className="w-72 bg-card border-r border-white/5 h-screen sticky top-0 hidden lg:flex flex-col p-6 overflow-y-auto">
      <div className="mb-10 px-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
            <Zap className="w-5 h-5 text-black fill-current" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white">EDGEBET</span>
        </Link>
      </div>

      <div className="flex-1">
        <div className="mb-8">
          <h5 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Main Menu</h5>
          {renderNavItems(MAIN_NAV_ITEMS)}
        </div>

        {isAdmin && (
          <div className="mb-8">
            <h5 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Administration</h5>
            {renderNavItems(ADMIN_NAV_ITEMS)}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-white/5">
        <div className="px-4 py-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Support</p>
          <p className="text-xs text-gray-400 leading-relaxed">Need help? Contact our analysts 24/7.</p>
          <button className="mt-3 text-xs font-bold text-white hover:text-primary transition-colors">Open Support Ticket</button>
        </div>
      </div>
    </aside>
  )
}
