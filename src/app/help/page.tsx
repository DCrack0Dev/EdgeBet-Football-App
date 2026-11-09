import Link from 'next/link'
import { PublicNavbar } from '@/components/PublicNavbar'
import { Footer } from '@/components/Footer'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-white">
      <PublicNavbar />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-primary">Support</p>
        <h1 className="text-4xl font-black tracking-tight">How can we help?</h1>
        <p className="mt-6 text-lg leading-relaxed text-gray-400">
          For account, subscription, or content questions, contact the EdgeBet team and include the email address on your account.
        </p>
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">Support email</p>
          <a className="mt-2 block text-lg font-bold text-primary hover:underline" href="mailto:support@edgebetfootball.com">
            support@edgebetfootball.com
          </a>
        </div>
        <Link href="/responsible-gambling" className="mt-8 inline-block text-sm font-bold text-gray-300 hover:text-white hover:underline">
          Need gambling support? Visit our responsible-gambling resources.
        </Link>
      </main>
      <Footer />
    </div>
  )
}
