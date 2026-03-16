import { LegalLayout } from '@/components/LegalLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how EdgeBet Football protects your data and handles your privacy.',
}

export default function PrivacyPage() {
  return (
    <LegalLayout 
      title="Privacy Policy" 
      subtitle="Your data, your privacy. How we handle your information at EdgeBet Football."
      lastUpdated="March 16, 2026"
    >
      <section>
        <h2>1. Information We Collect</h2>
        <p>
          At EdgeBet Football, we only collect the information necessary to provide you with our insights and subscription services.
        </p>
        <ul>
          <li><strong>Authentication Data:</strong> When you register, we collect your email address and full name through Supabase Auth.</li>
          <li><strong>Profile Information:</strong> Any avatar or profile details you choose to add to your account.</li>
          <li><strong>Usage Data:</strong> We may collect anonymized data on how you interact with our platform (e.g., pages visited, clicks on slips) to improve our service.</li>
          <li><strong>Payment Data:</strong> We use <strong>Stripe</strong> to process all payments. EdgeBet Football does not store your credit card or sensitive payment details. Stripe handles this securely and provides us with a confirmation of payment and subscription status.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>2. How We Use Your Data</h2>
        <p>
          We use your data strictly for the following purposes:
        </p>
        <ul>
          <li>To provide access to the premium areas of the platform.</li>
          <li>To send you real-time notifications about new slips, analysis, and result updates.</li>
          <li>To manage your subscription status and billing cycles.</li>
          <li>To communicate important service updates or support-related information.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>3. Data Sharing & Disclosure</h2>
        <p>
          We do not sell or rent your personal data to third parties. We only share information with our trusted service providers:
        </p>
        <ul>
          <li><strong>Supabase:</strong> For account management, authentication, and database services.</li>
          <li><strong>Stripe:</strong> For secure payment processing and subscription management.</li>
          <li><strong>Vercel:</strong> For hosting and delivery of the EdgeBet Football platform.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>4. Your Rights</h2>
        <p>
          You have the right to:
        </p>
        <ul>
          <li>Access the personal information we hold about you.</li>
          <li>Correct any inaccuracies in your personal data.</li>
          <li>Request the deletion of your account and associated data.</li>
          <li>Opt-out of marketing communications (though essential service notifications will still be sent).</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at <strong>privacy@edgebetfootball.com</strong>.
        </p>
      </section>

      <hr />

      <section>
        <h2>5. Security</h2>
        <p>
          We take data security seriously. We use industry-standard encryption and security protocols provided by Supabase and Vercel to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <hr />

      <section>
        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date.
        </p>
      </section>

      <hr />

      <section>
        <h2>7. Contact Information</h2>
        <p>
          For more information about our privacy practices, please contact us at <strong>privacy@edgebetfootball.com</strong>.
        </p>
      </section>
    </LegalLayout>
  )
}
