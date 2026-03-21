'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { LogOut, User, LayoutDashboard, Ticket, LineChart, History, Crown, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button, cn } from './Button'

export function Navbar({ profile }: { profile?: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Daily Slips', href: '/slips', icon: Ticket },
    { name: 'Analysis', href: '/analysis', icon: LineChart },
    { name: 'History', href: '/history', icon: History },
  ]

  const isAdmin = profile?.role === 'admin'
  const isPremium = profile?.subscriptions?.some((s: any) => s.status === 'premium') || isAdmin

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">EdgeBet <span className="text-white">Football</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    pathname === item.href 
                      ? 'text-primary bg-primary/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isPremium && (
              <Link href="/subscription">
                <Button variant="primary" size="sm" className="gap-2">
                  <Crown className="w-4 h-4" />
                  Go Premium
                </Button>
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm">Admin</Button>
              </Link>
            )}
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                {profile?.full_name || 'Profile'}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-background p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors',
                pathname === item.href 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {!isPremium && (
              <Link href="/subscription" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full gap-2">
                  <Crown className="w-4 h-4" />
                  Go Premium
                </Button>
              </Link>
            )}
            <Link href="/profile" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full gap-2">
                <User className="w-4 h-4" />
                Profile
              </Button>
            </Link>
            <Button variant="ghost" className="w-full gap-2 justify-start" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
