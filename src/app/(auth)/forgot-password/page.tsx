'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { AlertCircle, ArrowRight, Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
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
        subtitle="Reset link sent successfully."
      >
        <div className="text-center py-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Email Sent!</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            We've sent a password reset link to <span className="text-white font-bold">{email}</span>. Please check your inbox.
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
      title="Reset Password" 
      subtitle="Enter your email to receive a reset link."
    >
      <form className="space-y-5" onSubmit={handleReset}>
        <Link 
          href="/login" 
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Link>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

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

        <Button
          type="submit"
          isLoading={loading}
          className="w-full h-14 rounded-2xl font-black text-lg group"
        >
          SEND RESET LINK <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
    </AuthLayout>
  )
}
