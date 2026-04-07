import type { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'

export const metadata: Metadata = {
  title: 'Privacy Policy — Atrox',
  description: 'Privacy policy for Atrox, GDPR and CCPA compliant.',
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updatedAt="April 7, 2026">
      <section>
        <p>
          This Privacy Policy describes how Atrox collects, uses, and protects
          your personal information. We comply with the EU General Data
          Protection Regulation (GDPR), UK GDPR, and the California Consumer
          Privacy Act (CCPA/CPRA).
        </p>
        <p>
          <strong className="text-fg">Data Controller:</strong> Atrox, operated
          by an individual developer based in Japan. Contact:{' '}
          <a
            href="mailto:marumonomon77@gmail.com"
            className="text-gold hover:text-gold-muted underline"
          >
            marumonomon77@gmail.com
          </a>
        </p>
      </section>

      <section>
        <h2>1. Information We Collect</h2>
        <ul>
          <li>
            <strong className="text-fg">Account data:</strong> email address and
            bcrypt-hashed password
          </li>
          <li>
            <strong className="text-fg">Subscription data:</strong> Lemon
            Squeezy customer ID and subscription tier. Payment details (card
            numbers, billing address) are handled entirely by Lemon Squeezy and
            never stored by us
          </li>
          <li>
            <strong className="text-fg">Comments:</strong> text you voluntarily
            submit on episodes
          </li>
          <li>
            <strong className="text-fg">Technical data:</strong> server logs (IP
            address, user agent, timestamps) retained for up to 30 days for
            security and debugging
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Legal Basis for Processing (GDPR)</h2>
        <ul>
          <li>
            <strong className="text-fg">Contract:</strong> account creation,
            subscription delivery, access to episodes
          </li>
          <li>
            <strong className="text-fg">Legitimate interest:</strong> security
            logging, fraud prevention, service improvement
          </li>
          <li>
            <strong className="text-fg">Consent:</strong> optional features (if
            any) that require explicit opt-in
          </li>
          <li>
            <strong className="text-fg">Legal obligation:</strong> tax records,
            compliance with lawful requests
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To provide access to episodes based on your tier</li>
          <li>
            To aggregate comments and incorporate reader feedback into
            AI-generated episodes
          </li>
          <li>To process subscriptions via Lemon Squeezy</li>
          <li>To respond to your support inquiries</li>
        </ul>
        <p>
          We do not sell or share your personal information with third parties
          for marketing purposes.
        </p>
      </section>

      <section>
        <h2>4. Third-Party Services</h2>
        <ul>
          <li>
            <strong className="text-fg">Lemon Squeezy:</strong> Merchant of
            Record for all payment processing and global tax handling (
            <a
              href="https://www.lemonsqueezy.com/privacy"
              className="text-gold hover:text-gold-muted underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              privacy policy
            </a>
            )
          </li>
          <li>
            <strong className="text-fg">Anthropic (Claude):</strong> AI content
            generation. Reader comments may be sent to Claude as prompt input
          </li>
          <li>
            <strong className="text-fg">Vercel:</strong> hosting infrastructure
          </li>
          <li>
            <strong className="text-fg">Neon:</strong> PostgreSQL database
            hosting
          </li>
        </ul>
      </section>

      <section>
        <h2>5. International Data Transfers</h2>
        <p>
          Your data may be processed in the United States and other countries
          where our service providers operate. For transfers from the EU/UK, we
          rely on Standard Contractual Clauses (SCCs) or adequacy decisions as
          applicable.
        </p>
      </section>

      <section>
        <h2>6. Cookies and Tracking</h2>
        <p>
          We use essential cookies only — specifically for authenticated
          sessions. We do not use tracking, advertising, or analytics cookies.
          No consent banner is required under EU ePrivacy rules because only
          strictly necessary cookies are used.
        </p>
      </section>

      <section>
        <h2>7. Data Retention</h2>
        <p>
          Account data is retained while your account is active. Comments are
          retained to preserve episode context. Upon deletion request, personal
          data is removed within 30 days, except where retention is required by
          law (e.g., tax records).
        </p>
      </section>

      <section>
        <h2>8. Your Rights</h2>
        <p>Depending on your jurisdiction, you have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data (right to be forgotten)</li>
          <li>Restrict or object to certain processing</li>
          <li>Request data portability</li>
          <li>
            Withdraw consent at any time (where processing is based on consent)
          </li>
          <li>Lodge a complaint with your local data protection authority</li>
        </ul>
        <p>
          <strong className="text-fg">California residents (CCPA):</strong> You
          have the right to know, delete, correct, and opt out of sale/sharing
          of personal information. Atrox does not sell personal information.
        </p>
        <p>
          To exercise any of these rights, email{' '}
          <a
            href="mailto:marumonomon77@gmail.com"
            className="text-gold hover:text-gold-muted underline"
          >
            marumonomon77@gmail.com
          </a>
          . We respond within 30 days.
        </p>
      </section>

      <section>
        <h2>9. Automated Processing</h2>
        <p>
          Atrox uses AI (Claude) to generate episodes based on your comments.
          This is creative content generation, not automated decision-making
          with legal or significant effects on you.
        </p>
      </section>

      <section>
        <h2>10. Security</h2>
        <p>
          Passwords are hashed with bcrypt. All traffic is served over HTTPS. We
          use signed JWT sessions and HMAC-verified webhooks. Data breaches
          affecting EU/UK users will be notified to the relevant supervisory
          authority within 72 hours.
        </p>
      </section>

      <section>
        <h2>11. Children&apos;s Privacy</h2>
        <p>
          Atrox is restricted to users 18 and older. We do not knowingly collect
          personal information from minors. If you believe a minor has provided
          us with data, contact us for immediate deletion.
        </p>
      </section>

      <section>
        <h2>12. Changes to This Policy</h2>
        <p>
          Material changes will be notified via email or in-app banner.
          Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          For privacy questions or to exercise your rights:{' '}
          <a
            href="mailto:marumonomon77@gmail.com"
            className="text-gold hover:text-gold-muted underline"
          >
            marumonomon77@gmail.com
          </a>
        </p>
      </section>
    </LegalLayout>
  )
}
