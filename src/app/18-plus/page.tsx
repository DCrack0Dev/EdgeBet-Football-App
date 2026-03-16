import { LegalLayout } from '@/components/LegalLayout'
import { Metadata } from 'next'
import { ShieldCheck, UserCheck, AlertOctagon } from 'lucide-react'

export const metadata: Metadata = {
  title: '18+ Age Notice',
  description: 'Important notice regarding age requirements for using EdgeBet Football.',
}

export default function AgeNoticePage() {
  return (
    <LegalLayout 
      title="18+ Age Notice" 
      subtitle="The age requirement for using EdgeBet Football insights."
      lastUpdated="March 16, 2026"
    >
      <section>
        <div className="p-12 md:p-20 rounded-[48px] bg-white/5 border border-white/10 text-center relative overflow-hidden group mb-16">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
            <UserCheck className="w-64 h-64 text-primary" />
          </div>
          <div className="relative z-10 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/30">
              <span className="text-3xl font-black text-primary italic tracking-tighter">18+</span>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4 italic">Strict Age Requirement</h2>
            <p className="text-gray-400 font-medium text-lg leading-relaxed mb-0">
              EdgeBet Football is strictly for users aged 18 and over.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>1. Why We Enforce This</h2>
        <p>
          While EdgeBet Football is an information platform and not a gambling site, the content we provide is related to sports betting and gambling markets. In many jurisdictions, accessing gambling-related information is restricted to adults. We believe in protecting minors from premature exposure to gambling risks.
        </p>
      </section>

      <hr />

      <section>
        <h2>2. User Responsibility</h2>
        <p>
          By creating an account or subscribing to EdgeBet Football, you represent and warrant that you are at least 18 years of age (or the legal age of majority in your jurisdiction, whichever is higher). Falsifying your age to gain access to our service is a violation of our <a href="/terms">Terms of Service</a> and will result in immediate account termination.
        </p>
      </section>

      <hr />

      <section>
        <h2>3. Parental Controls</h2>
        <p>
          We encourage parents to take an active role in their children's online safety. If you have minors in your household, we recommend using filtering software to block access to gambling-related sites and information services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black mb-4 italic">Net Nanny</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Leading filtering software to help protect your children from inappropriate online content.
            </p>
          </div>
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <AlertOctagon className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black mb-4 italic">CyberSitter</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Provides comprehensive filtering and monitoring for household internet access.
            </p>
          </div>
        </div>
      </section>

      <hr />

      <section>
        <h2>4. Contact Us</h2>
        <p>
          If you have any questions or concerns regarding our age policy, please contact our support team at <strong>support@edgebetfootball.com</strong>.
        </p>
      </section>
    </LegalLayout>
  )
}
