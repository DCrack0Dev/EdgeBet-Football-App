'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Trophy, Ticket, Settings, ArrowLeft } from 'lucide-react'
import { cn } from './Button'

export function AdminNavbar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Admin Home', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Matches', href: '/admin/matches', icon: Trophy },
    { name: 'Manage Picks', href: '/admin/picks', icon: Ticket },
    { name: 'Manage Slips', href: '/admin/slips', icon: Ticket },
    { name: 'Users Overview', href: '/admin/users', icon: Users },
  ]

  return (
    <nav className="w-64 border-r border-white/10 bg-card h-screen fixed left-0 top-0 hidden lg:block overflow-y-auto">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to App</span>
        </Link>
        <div className="mb-8">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Admin Panel</span>
          <h2 className="text-xl font-bold text-white mt-1">EdgeBet <span className="text-primary">Admin</span></h2>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all',
                pathname === item.href 
                  ? 'text-primary bg-primary/10 border border-primary/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="p-6 border-t border-white/10 mt-auto">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </nav>
  )
}
