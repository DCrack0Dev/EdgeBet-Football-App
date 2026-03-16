import { LegalLayout } from '@/components/LegalLayout'
import { Metadata } from 'next'
import { ShieldCheck, Heart, Clock, Wallet, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Responsible Gambling',
  description: 'Learn how to gamble responsibly and where to find help if needed.',
}

export default function ResponsibleGamblingPage() {
  return (
    <LegalLayout 
      title="Responsible Gambling" 
      subtitle="Play smart. Stay in control. EdgeBet Football's commitment to your well-being."
      lastUpdated="March 16, 2026"
    >
      <section>
        <h2>Our Commitment</h2>
        <p>
          At EdgeBet Football, we believe that sports betting should be a fun and engaging way to follow the beautiful game. However, we also recognize the risks associated with gambling. Our goal is to provide you with the best insights to make informed decisions, while encouraging you to always play responsibly.
        </p>
      </section>

      <hr />

      <section>
        <h2>Signs of Problem Gambling</h2>
        <p>
          It is important to recognize when betting stops being fun. Ask yourself:
        </p>
        <ul>
          <li>Are you betting more than you can afford to lose?</li>
          <li>Are you chasing losses?</li>
          <li>Is betting affecting your relationships or work?</li>
          <li>Do you feel anxious or irritable when not betting?</li>
          <li>Have you ever lied about your betting habits?</li>
        </ul>
      </section>

      <hr />

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black mb-4">Set Limits</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Always set a budget before you start. Never bet with money meant for essentials like rent, bills, or food.
            </p>
          </div>
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black mb-4">Take Breaks</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Betting should be one of many activities you enjoy. If you find yourself spending too much time on it, step away for a while.
            </p>
          </div>
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black mb-4">It's Not a Job</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Never view betting as a way to make a living or pay off debts. It is a form of entertainment with no guaranteed outcomes.
            </p>
          </div>
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black mb-4">Stay Sober</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Avoid betting while under the influence of alcohol or other substances, as they can impair your judgment.
            </p>
          </div>
        </div>
      </section>

      <hr />

      <section>
        <h2>Support Resources</h2>
        <p>
          If you or someone you know is struggling with gambling, help is available. These organizations provide confidential and free support:
        </p>
        <ul>
          <li><strong>BeGambleAware:</strong> <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer">www.begambleaware.org</a></li>
          <li><strong>GamCare:</strong> <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer">www.gamcare.org.uk</a></li>
          <li><strong>Gamblers Anonymous:</strong> <a href="https://www.gamblersanonymous.org" target="_blank" rel="noopener noreferrer">www.gamblersanonymous.org</a></li>
          <li><strong>National Problem Gambling Helpline (USA):</strong> 1-800-522-4700</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>Underage Gambling</h2>
        <p>
          Gambling by anyone under the age of 18 is strictly prohibited. EdgeBet Football requires all users to confirm they are 18+ before accessing our services. We encourage parents to use filtering software like <strong>Net Nanny</strong> or <strong>CyberSitter</strong> to block access to gambling-related sites.
        </p>
      </section>

      <hr />

      <section>
        <h2>Our Stance</h2>
        <p>
          EdgeBet Football is an information platform, not a gambling operator. We do not provide the means to place bets, and we do not profit from your losses. Our revenue comes solely from subscriptions, and our mission is to provide you with the most accurate information possible to make informed choices.
        </p>
      </section>
    </LegalLayout>
  )
}
