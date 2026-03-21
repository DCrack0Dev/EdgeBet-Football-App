'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { AlertCircle, ArrowRight, Mail, Lock } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirect || '/dashboard')
      router.refresh()
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleLogin}>
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-2xl border-0 bg-white/5 py-4 pl-12 pr-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-2xl border-0 bg-white/5 py-4 pl-12 pr-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-xs font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] rounded-2xl group relative overflow-hidden"
        disabled={loading}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </Button>
    </form>
  )
}

export default function Login() {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to access your daily football edge."
    >
      <Suspense fallback={<div className="h-48 flex items-center justify-center text-xs text-gray-500 font-black uppercase tracking-widest">Loading...</div>}>
        <LoginForm />
      </Suspense>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400 font-medium leading-relaxed">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-primary hover:underline transition-all">
            Start Free Trial
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
