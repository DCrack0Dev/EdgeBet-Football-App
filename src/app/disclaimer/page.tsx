import { LegalLayout } from '@/components/LegalLayout'
import { Metadata } from 'next'
import { AlertTriangle, TrendingDown, ShieldAlert } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Risk Disclaimer',
  description: 'Important notice regarding the risks of sports betting and the lack of guaranteed outcomes.',
}

export default function DisclaimerPage() {
  return (
    <LegalLayout 
      title="Risk Disclaimer" 
      subtitle="The reality of betting. Understanding that results are never guaranteed."
      lastUpdated="March 16, 2026"
    >
      <section>
        <div className="p-8 rounded-[40px] bg-primary/10 border border-primary/20 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-black m-0">No Guaranteed Winnings</h2>
          </div>
          <p className="text-gray-300 font-bold text-lg leading-relaxed italic m-0">
            "EdgeBet Football provides betting insights and analysis for informational purposes only. We do not guarantee any specific financial outcome, winnings, or profits from the use of our service."
          </p>
        </div>
      </section>

      <section>
        <h2>1. Statistical Nature of Insights</h2>
        <p>
          Our picks, slips, and analysis are based on historical data, statistical trends, and analyst opinions. While we strive for accuracy and use professional methodologies, sports events are inherently unpredictable. Randomness, injuries, tactical shifts, and human error are factors that no data model can fully account for.
        </p>
      </section>

      <hr />

      <section>
        <h2>2. Past Performance</h2>
        <p>
          Any mention of past performance, hit rates, or ROI on our platform is a record of historical results. <strong>Past performance is not indicative of future results.</strong> A winning streak in the past does not guarantee a winning streak in the future.
        </p>
      </section>

      <hr />

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
            <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6">
              <TrendingDown className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-black mb-4 uppercase italic">Lose What You Can Afford</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Never bet more than you are prepared to lose. Betting should be considered a form of paid entertainment, not an investment strategy.
            </p>
          </div>
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black mb-4 uppercase italic">Personal Responsibility</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              You are solely responsible for any financial decisions you make. EdgeBet Football is not liable for any losses incurred by users following our insights.
            </p>
          </div>
        </div>
      </section>

      <hr />

      <section>
        <h2>3. Not Financial Advice</h2>
        <p>
          The content on EdgeBet Football does not constitute financial, investment, or legal advice. We are an information service for sports enthusiasts. If you believe you have a gambling problem, please visit our <a href="/responsible-gambling">Responsible Gambling</a> page for resources and support.
        </p>
      </section>

      <hr />

      <section>
        <h2>4. Local Laws</h2>
        <p>
          It is your responsibility to ensure that sports betting is legal in your jurisdiction before using our insights to place bets on third-party platforms. EdgeBet Football does not provide legal guidance on the status of gambling in any country or region.
        </p>
      </section>
    </LegalLayout>
  )
}
