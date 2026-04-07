import type { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'

export const metadata: Metadata = {
  title: 'Privacy Policy — Atrox',
  description: 'Privacy policy for Atrox, GDPR-compliant.',
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updatedAt="April 7, 2026">
      <section>
        <p>
          This Privacy Policy describes how Atrox collects, uses, and protects
          your personal information. We comply with GDPR and take your privacy
          seriously.
        </p>
      </section>

      <section>
        <h2>1. Information We Collect</h2>
        <ul>
          <li>
            <strong className="text-fg">Account data:</strong> email address and
            hashed password you provide at sign-up
          </li>
          <li>
            <strong className="text-fg">Subscription data:</strong> Stripe
            customer ID and subscription tier (payment details are handled by
            Stripe, never stored by us)
          </li>
          <li>
            <strong className="text-fg">Comments:</strong> text you voluntarily
            submit on episodes
          </li>
          <li>
            <strong className="text-fg">Technical data:</strong> minimal server
            logs (IP, user agent) for security and debugging
          </li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide access to episodes based on your tier</li>
          <li>
            To aggregate comments and incorporate reader feedback into future
            AI-generated episodes
          </li>
          <li>To process subscriptions and prevent fraud via Stripe</li>
          <li>To respond to your support inquiries</li>
        </ul>
        <p>
          We do not sell, rent, or share your personal information with third
          parties for marketing purposes.
        </p>
      </section>

      <section>
        <h2>3. Third-Party Services</h2>
        <ul>
          <li>
            <strong className="text-fg">Stripe:</strong> payment processing (see{' '}
            <a
              href="https://stripe.com/privacy"
              className="text-gold hover:text-gold-muted underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Privacy Policy
            </a>
            )
          </li>
          <li>
            <strong className="text-fg">Anthropic (Claude):</strong> AI content
            generation. Reader comments may be sent to Claude as part of prompt
            input
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
        <h2>4. Cookies</h2>
        <p>
          We use essential cookies for authentication sessions. We do not use
          tracking or advertising cookies. If you are in the EU, no consent
          banner is required because we only use strictly necessary cookies.
        </p>
      </section>

      <section>
        <h2>5. Data Retention</h2>
        <p>
          We retain your account data for as long as your account is active.
          Comments are retained to preserve episode context. Upon account
          deletion, personal data is removed within 30 days, except where
          retention is required by law.
        </p>
      </section>

      <section>
        <h2>6. Your Rights (GDPR)</h2>
        <p>If you are in the EU/UK, you have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to certain processing activities</li>
          <li>Request data portability</li>
          <li>Lodge a complaint with your local data authority</li>
        </ul>
        <p>
          To exercise these rights, contact us via email (below). We respond
          within 30 days.
        </p>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>
          Passwords are hashed with bcrypt. All traffic is served over HTTPS. We
          use signed JWT sessions and CSRF protection. However, no system is
          perfectly secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>8. Children&apos;s Privacy</h2>
        <p>
          Atrox is not intended for users under 18. We do not knowingly collect
          information from minors.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          For privacy questions or to exercise your rights, email:{' '}
          <a
            href="mailto:privacy@atrox.example"
            className="text-gold hover:text-gold-muted underline"
          >
            privacy@atrox.example
          </a>
        </p>
        <p className="text-sm text-fg-muted">
          (Replace with your actual contact email before launch)
        </p>
      </section>
    </LegalLayout>
  )
}
