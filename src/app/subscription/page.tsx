'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { AppLayout } from '@/components/AppLayout'
import { Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { 
  Check, 
  Crown, 
  ShieldCheck, 
  Target, 
  Lock,
  ChevronRight,
  Sparkles,
  Settings,
  AlertCircle,
  Zap,
  Bell,
  BarChart3,
  CreditCard,
  History,
  Undo2
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/supabase'

export default function SubscriptionPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*, subscriptions(*)')
          .eq('id', session.user.id)
          .single()
        setProfile(data)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const activeSub = profile?.subscriptions?.find((s: any) => s.status === 'premium')
  const isPremium = !!activeSub || profile?.role === 'admin'
  const isFakeMode = process.env.NEXT_PUBLIC_USE_FAKE_PAYMENTS === 'true'

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutLoading(true)
    setError(null)

    try {
      const endpoint = isFakeMode ? '/api/fake-upgrade' : '/api/peach/checkout'
      const response = await fetch(endpoint, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to initiate checkout')
      }

      if (isFakeMode) {
        // Instant upgrade for fake mode
        window.location.href = '/dashboard?success=true'
      } else {
        const { url } = await response.json()
        window.location.href = url
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message)
      setCheckoutLoading(false)
    }
  }

  const handleReset = async () => {
    setCheckoutLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/fake-downgrade', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to reset')
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
      setCheckoutLoading(false)
    }
  }

  const plans = [
    {
      name: 'Free',
      price: 'R0',
      description: 'Perfect for exploring our platform and basic insights.',
      features: [
        { text: 'Limited daily slips (1-2/day)', included: true },
        { text: 'Basic match analysis', included: true },
        { text: 'Public picks access', included: true },
        { text: 'Combo & Premium Slips', included: false },
        { text: 'Expert analyst reasoning', included: false },
        { text: 'Confidence scores (1-10)', included: false },
        { text: 'Priority mobile alerts', included: false },
      ],
      cta: isPremium ? 'Current Plan' : 'Get Started',
      variant: 'outline' as const,
      isCurrent: !isPremium,
      onCtaClick: isPremium && isFakeMode ? handleReset : undefined
    },
    {
      name: 'Premium',
      price: isFakeMode ? 'R0' : 'R199.00',
      period: '/month',
      description: 'The ultimate edge for serious football bettors.',
      features: [
        { text: 'Unrestricted daily slips & combos', included: true },
        { text: 'Full expert analyst reasoning', included: true },
        { text: 'Data-driven confidence scores', included: true },
        { text: 'Premium-only match analysis', included: true },
        { text: 'Full verified results history', included: true },
        { text: 'Priority real-time alerts', included: true },
        { text: '24/7 Priority support', included: true },
      ],
      cta: isPremium ? 'Manage Subscription' : (isFakeMode ? 'Upgrade to Premium (Test Mode)' : 'Unlock Premium Access'),
      variant: 'primary' as const,
      isCurrent: isPremium,
      highlight: true,
      popular: true
    }
  ]

  return (
    <AppLayout profile={profile}>
      <div className="max-w-6xl mx-auto py-8">
        <header className="text-center mb-16 space-y-4">
          {isFakeMode && (
            <Badge variant="outline" className="px-4 py-1.5 text-[10px] font-bold border-yellow-500/50 text-yellow-500 bg-yellow-500/10 mb-4">
              <AlertCircle className="w-3.5 h-3.5 mr-2" /> Test Mode Active – No Real Payments
            </Badge>
          )}
          <Badge variant="primary" className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] bg-primary/20">
            <Sparkles className="w-4 h-4 mr-2" /> Elevate Your Edge
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
            Choose Your <span className="text-primary">Victory Plan</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg max-w-2xl mx-auto">
            Unlock professional-grade analysis and high-confidence slips designed to maximize your betting ROI.
          </p>
        </header>

        {/* Plan Toggle Placeholder */}
        <div className="flex justify-center mb-12">
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300 max-w-2xl mx-auto w-full">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{error}</p>
            </div>
          )}
          <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex items-center gap-2">
            <button className="px-8 py-2.5 rounded-xl bg-primary text-black text-xs font-black uppercase tracking-widest transition-all">Monthly</button>
            <button className="px-8 py-2.5 rounded-xl text-gray-500 text-xs font-black uppercase tracking-widest hover:text-white transition-all">Yearly <span className="text-primary ml-1">-20%</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={cn(
                "relative overflow-hidden flex flex-col p-10 md:p-12 transition-all duration-500 border-2",
                plan.highlight 
                  ? "bg-gradient-to-br from-primary/10 via-background to-background border-primary/40 shadow-[0_0_80px_rgba(212,175,55,0.15)]" 
                  : "bg-white/5 border-white/5"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-bl-2xl shadow-lg">
                  Most Popular
                </div>
              )}
              {plan.highlight && (
                <div className="absolute top-0 left-0 p-8">
                  <Crown className="w-12 h-12 text-primary opacity-20 rotate-12" />
                </div>
              )}

              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-white uppercase tracking-widest italic">{plan.name}</h3>
                  {plan.isCurrent && (
                    <Badge variant="outline" className="text-[10px] font-black uppercase bg-white/10 border-white/10 text-gray-400">Current Plan</Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-black text-white tracking-tighter">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">{plan.period}</span>}
                </div>
                <p className="text-gray-400 font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                      feature.included ? "bg-primary/20 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-gray-700"
                    )}>
                      {feature.included ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </div>
                    <span className={cn("text-sm font-bold", feature.included ? "text-gray-300" : "text-gray-600")}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                {plan.name === 'Premium' ? (
                  <Button 
                    className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] rounded-2xl group relative overflow-hidden"
                    variant={plan.variant}
                    disabled={plan.isCurrent || checkoutLoading}
                    onClick={handleCheckout}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {checkoutLoading ? (
                        <Zap className="w-4 h-4 animate-pulse" />
                      ) : (
                        <>
                          {plan.cta} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    {plan.highlight && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-white/20 to-primary translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-30" />
                    )}
                  </Button>
                ) : (
                  <Button 
                    className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] rounded-2xl"
                    variant={plan.variant}
                    disabled={plan.isCurrent || (isFakeMode && !isPremium)}
                    onClick={plan.onCtaClick}
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* What Unlocks Immediately Section */}
        {!isPremium && (
          <section className="mb-20">
            <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-8">What unlocks immediately after payment?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Instant Access', desc: 'Every active premium slip and analysis is revealed instantly.', icon: Zap },
                { title: 'Priority Alerts', desc: 'Enable browser or mobile notifications for new expert picks.', icon: Bell },
                { title: 'Full History', desc: 'Review our entire performance history with deep data drill-downs.', icon: BarChart3 }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.07] transition-colors group">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3">{item.title}</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trust Section */}
        <section className="bg-white/5 rounded-[48px] border border-white/5 p-12 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-16">
            {[
              { label: 'Avg Monthly Profit', value: '+18.5u', icon: TrendingUp, color: 'text-primary' },
              { label: 'Win Rate', value: '74%', icon: Target, color: 'text-green-500' },
              { label: 'Expert Analysts', value: '24/7', icon: ShieldCheck, color: 'text-blue-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className={cn("w-16 h-16 rounded-3xl bg-white/5 mx-auto flex items-center justify-center border border-white/5", item.color)}>
                  <item.icon className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{item.label}</h4>
                  <p className="text-4xl font-black text-white tracking-tighter">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-8 pt-12 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <CreditCard className="w-5 h-5" />
                  <h5 className="text-white font-black uppercase tracking-widest text-xs">Billing Transparency</h5>
                </div>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  Billed every 30 days starting from the date of purchase. No hidden fees. 
                  Digital receipts are automatically sent to your email for every transaction.
                </p>
              </div>
              <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Undo2 className="w-5 h-5" />
                  <h5 className="text-white font-black uppercase tracking-widest text-xs">Cancellation Policy</h5>
                </div>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  Cancel anytime via your Profile. You'll keep access until your current period ends. 
                  We believe in total flexibility—no questions asked.
                </p>
              </div>
            </div>

            <div className="p-8 bg-primary/5 border border-primary/20 rounded-[32px]">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-3">
                  <h5 className="text-primary font-black uppercase tracking-widest text-xs">Risk & Responsibility</h5>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    EdgeBet Football is a statistical analysis tool. Sports results are unpredictable. 
                    We do not guarantee profits. Betting involves risk of loss. 
                    <span className="text-primary font-black ml-1">Play only with what you can afford to lose.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Disclaimer Footer */}
        <div className="mt-20 pt-12 border-t border-white/5 text-center max-w-2xl mx-auto space-y-6">
          <p className="text-gray-500 text-xs font-medium leading-relaxed">
            By subscribing, you agree to our <Link href="/terms" className="text-white hover:text-primary transition-colors underline underline-offset-4 font-bold">Terms of Service</Link>, <Link href="/privacy" className="text-white hover:text-primary transition-colors underline underline-offset-4 font-bold">Privacy Policy</Link>, and <Link href="/disclaimer" className="text-white hover:text-primary transition-colors underline underline-offset-4 font-bold">Full Disclaimer</Link>. 
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link href="/18-plus" className="text-[10px] text-gray-600 font-black uppercase tracking-widest hover:text-gray-400 transition-colors italic flex items-center gap-2">
              <span className="w-5 h-5 rounded-full border border-gray-800 flex items-center justify-center text-[8px] not-italic">18+</span>
              Play Responsibly
            </Link>
            <Link href="/responsible-gambling" className="text-[10px] text-gray-600 font-black uppercase tracking-widest hover:text-gray-400 transition-colors italic">Gambling Help Resources</Link>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

const TrendingUp = (props: any) => (
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
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)
