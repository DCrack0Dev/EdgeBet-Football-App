'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MAIN_NAV_ITEMS } from '@/lib/navigation'
import { cn } from '@/lib/supabase'

export function MobileNav() {
  const pathname = usePathname()
  
  // Only show first 5 items on mobile bottom nav
  const mobileItems = MAIN_NAV_ITEMS.slice(0, 5)

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-card/80 backdrop-blur-xl border-t border-white/5 z-50 px-2 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full h-full transition-all group',
                isActive ? 'text-primary' : 'text-gray-500'
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all",
                isActive ? "bg-primary/10" : "group-hover:bg-white/5"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {item.name.split(' ')[0]}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
