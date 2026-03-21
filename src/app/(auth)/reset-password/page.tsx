'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { AlertCircle, ArrowRight, Lock, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  }

  if (success) {
    return (
      <AuthLayout 
        title="Password Updated" 
        subtitle="Your security is our priority."
      >
        <div className="text-center py-4">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Success!</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Your password has been reset successfully. Redirecting you to login...
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Set New Password" 
      subtitle="Choose a strong password for your account."
    >
      <form className="space-y-5" onSubmit={handleReset}>
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full rounded-2xl border-0 bg-white/5 py-4 pl-12 pr-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              className="block w-full rounded-2xl border-0 bg-white/5 py-4 pl-12 pr-4 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full h-14 rounded-2xl font-black text-lg group"
        >
          UPDATE PASSWORD <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
    </AuthLayout>
  )
}
