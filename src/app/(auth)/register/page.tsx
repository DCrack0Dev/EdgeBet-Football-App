'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { AlertCircle, ArrowRight, Mail, Lock, User, CheckCircle2 } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle="We've sent you a confirmation link."
      >
        <div className="text-center py-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Registration Successful!</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Please click the link in the email we sent to <span className="text-white font-bold">{email}</span> to activate your account.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full h-12 rounded-xl font-bold">
              Return to Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join 12,000+ bettors gaining the edge."
    >
      <form className="space-y-5" onSubmit={handleRegister}>
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input
              id="full-name"
              name="name"
              type="text"
              required
              className="block w-full rounded-2xl border-0 bg-white/5 py-4 pl-12 pr-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

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
          
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full rounded-2xl border-0 bg-white/5 py-4 pl-12 pr-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full h-14 rounded-2xl font-black text-lg group"
        >
          CREATE ACCOUNT <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="mt-8 text-center text-xs text-gray-500 font-medium leading-relaxed">
          By creating an account, you agree to our <Link href="/terms" className="text-white hover:text-primary transition-colors underline underline-offset-4">Terms of Service</Link> and <Link href="/privacy" className="text-white hover:text-primary transition-colors underline underline-offset-4">Privacy Policy</Link>, and confirm you are at least <Link href="/18-plus" className="text-white hover:text-primary transition-colors underline underline-offset-4 font-bold">18 years of age</Link>.
        </p>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-primary hover:text-primary-light transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
