import { LegalLayout } from '@/components/LegalLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using EdgeBet Football insights and subscription services.',
}

export default function TermsPage() {
  return (
    <LegalLayout 
      title="Terms of Service" 
      subtitle="The rules of the game. Understanding your relationship with EdgeBet Football."
      lastUpdated="March 16, 2026"
    >
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using EdgeBet Football ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our Service. EdgeBet Football provides betting insights, statistical analysis, and curated picks for informational purposes only.
        </p>
      </section>

      <hr />

      <section>
        <h2>2. Description of Service</h2>
        <p>
          EdgeBet Football is a subscription-based digital information platform. We provide:
        </p>
        <ul>
          <li>Expert curated daily betting slips (Safe, Balanced, Aggressive).</li>
          <li>In-depth technical match analysis and tactical breakdowns.</li>
          <li>Historical performance tracking and auditing.</li>
          <li>Real-time notifications for new insights.</li>
        </ul>
        <p>
          <strong>Important:</strong> EdgeBet Football is NOT a bookmaker or a gambling site. We do not accept bets, handle money for wagering, or provide any platform for placing bets. We are an information provider only.
        </p>
      </section>

      <hr />

      <section>
        <h2>3. Eligibility (18+)</h2>
        <p>
          You must be at least 18 years of age (or the legal age of majority in your jurisdiction, whichever is higher) to use this Service. By using EdgeBet Football, you represent and warrant that you meet this requirement. It is your responsibility to comply with local gambling and information access laws.
        </p>
      </section>

      <hr />

      <section>
        <h2>4. Subscription Billing & Access</h2>
        <p>
          Access to premium insights requires a paid subscription.
        </p>
        <ul>
          <li><strong>Billing:</strong> Subscriptions are processed through Stripe and billed on a recurring basis (monthly or annually) as selected during checkout.</li>
          <li><strong>Access:</strong> Premium content is gated and only accessible to users with an active, paid subscription or administrative privileges.</li>
          <li><strong>Cancellation:</strong> You may cancel your subscription at any time through your Profile settings. Access will remain active until the end of the current billing period.</li>
          <li><strong>Refunds:</strong> Due to the digital nature of our real-time insights, refunds are generally not provided once a billing cycle has commenced, except as required by law.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>5. No Guaranteed Winnings</h2>
        <p>
          Sports betting involves significant risk. EdgeBet Football provides opinions and statistical analysis, not financial advice.
        </p>
        <p>
          <strong>WE DO NOT GUARANTEE ANY SPECIFIC OUTCOME, WINNINGS, OR PROFIT.</strong> Past performance is not indicative of future results. You acknowledge that you use our insights at your own risk and that you should never bet more than you can afford to lose.
        </p>
      </section>

      <hr />

      <section>
        <h2>6. User Responsibility</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your premium access or redistribute our insights, slips, or analysis without express written consent. Unauthorized distribution of our content is grounds for immediate account termination without refund.
        </p>
      </section>

      <hr />

      <section>
        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, EdgeBet Football and its analysts shall not be liable for any financial losses, damages, or consequences resulting from the use of our insights or the inability to access the Service.
        </p>
      </section>

      <hr />

      <section>
        <h2>8. Contact Us</h2>
        <p>
          If you have questions regarding these Terms, please contact us at <strong>legal@edgebetfootball.com</strong>.
        </p>
      </section>
    </LegalLayout>
  )
}
