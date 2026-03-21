'use client'

import { useState, useEffect } from 'react'
import { Bell, Zap, Trophy, CreditCard, ShieldCheck, X } from 'lucide-react'
import { Badge } from './Card'
import { Button, cn } from './Button'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

interface Notification {
  id: string
  type: 'new_slip' | 'premium_slip' | 'result_update' | 'subscription' | 'system'
  title: string
  message: string
  link?: string
  is_read: boolean
  created_at: string
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )

  useEffect(() => {
    fetchNotifications()

    // Real-time subscription
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications' 
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev])
        setUnreadCount(prev => prev + 1)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) {
      setNotifications(data as Notification[])
      setUnreadCount(data.filter(n => !n.is_read).length)
    }
  }

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_slip': return <Zap className="w-4 h-4 text-primary" />
      case 'premium_slip': return <ShieldCheck className="w-4 h-4 text-primary" />
      case 'result_update': return <Trophy className="w-4 h-4 text-green-500" />
      case 'subscription': return <CreditCard className="w-4 h-4 text-blue-500" />
      default: return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-[#0A0A0A]" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-80 md:w-96 bg-[#0F0F0F] border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Notifications</h3>
              <Badge variant="outline" className="text-[10px] font-black uppercase bg-white/5 border-white/10">{unreadCount} New</Badge>
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={cn(
                        "p-5 hover:bg-white/5 transition-all group cursor-pointer relative",
                        !n.is_read && "bg-primary/5"
                      )}
                    >
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                          {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[11px] font-black text-white uppercase tracking-tight truncate pr-4">{n.title}</span>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter whitespace-nowrap">
                              {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2">{n.message}</p>
                          {n.link && (
                            <Link 
                              href={n.link} 
                              className="inline-flex items-center gap-1 mt-3 text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                            >
                              View Details <ChevronRight className="w-2.5 h-2.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <Bell className="w-6 h-6 text-gray-700" />
                  </div>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">All caught up!</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-white/5 text-center">
                <button className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors">
                  Clear All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const ChevronRight = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)
