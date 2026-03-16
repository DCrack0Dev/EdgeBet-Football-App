'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { 
  ChevronDown, 
  Crown, 
  LogOut, 
  Menu, 
  Search, 
  User, 
  X,
  Settings,
  HelpCircle
} from 'lucide-react'
import { Button, cn } from '@/components/Button'
import { NotificationDropdown } from './NotificationDropdown'
import { Profile } from '@/lib/supabase'

interface TopNavProps {
  profile: Profile | null;
  isPremium: boolean;
  onMobileMenuToggle: () => void;
}

export function TopNav({ profile, isPremium, onMobileMenuToggle }: TopNavProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-20 bg-background/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 px-4 md:px-8">
      <div className="h-full flex items-center justify-between gap-4">
        {/* Mobile Toggle & Search */}
        <div className="flex items-center gap-4 flex-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden p-2"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="hidden md:flex items-center relative max-w-md w-full group">
            <Search className="absolute left-4 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search matches, slips or analysis..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2 md:gap-6">
          {isPremium ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Crown className="w-4 h-4 text-primary fill-current" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Premium Member</span>
            </div>
          ) : (
            <Link href="/subscription" className="hidden sm:block">
              <Button variant="primary" size="sm" className="font-black text-[10px] tracking-widest">UPGRADE</Button>
            </Link>
          )}

          <div className="flex items-center gap-1 md:gap-2">
            <NotificationDropdown />
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-2xl hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="hidden lg:flex flex-col items-start text-left">
                  <span className="text-sm font-bold text-white leading-none mb-1">
                    {profile?.full_name?.split(' ')[0] || 'User'}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                    {profile?.role === 'admin' ? 'Administrator' : isPremium ? 'Premium' : 'Free Plan'}
                  </span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isProfileOpen && "rotate-180")} />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-3 w-64 bg-card border border-white/10 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-sm font-bold text-white">{profile?.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                    </div>
                    
                    <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      <Settings className="w-4 h-4" /> Account Settings
                    </Link>
                    <Link href="/help" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      <HelpCircle className="w-4 h-4" /> Help Center
                    </Link>
                    
                    <div className="border-t border-white/5 mt-2 pt-2">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
