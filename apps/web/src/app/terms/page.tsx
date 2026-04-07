import type { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'

export const metadata: Metadata = {
  title: 'Terms of Service — Atrox',
  description: 'Terms of service for Atrox, an AI serial fiction platform.',
}

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updatedAt="April 7, 2026">
      <section>
        <p>
          By accessing or using Atrox (&ldquo;the Service&rdquo;), you agree to
          be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do
          not agree, do not use the Service.
        </p>
      </section>

      <section>
        <h2>1. Age Requirement</h2>
        <p>
          You must be at least 18 years old to use Atrox. The Service contains
          dark romantasy fiction that may include mature themes, morally gray
          characters, and depictions of violence or sensual content. By using
          the Service, you represent that you are of legal age in your
          jurisdiction.
        </p>
      </section>

      <section>
        <h2>2. AI-Generated Content Disclosure</h2>
        <p>
          All episodes, character responses, and fiction on Atrox are generated
          by an AI author character named Vesper Black, powered by
          Anthropic&apos;s Claude API. Vesper Black is a fictional persona, not
          a human author. AI-generated content may occasionally produce
          unexpected, inconsistent, or offensive output.
        </p>
      </section>

      <section>
        <h2>3. Intellectual Property</h2>
        <p>
          The Atrox platform, brand, and original character concepts (including
          Vesper Black) are owned by Atrox. Episodes generated on the platform
          are licensed to you for personal, non-commercial reading use.
        </p>
        <ul>
          <li>You may not redistribute, republish, or sell episodes</li>
          <li>You may not use the content to train other AI models</li>
          <li>
            Reader comments you submit grant Atrox a non-exclusive, worldwide,
            royalty-free license to use them as input for future episode
            generation
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Subscriptions, Billing, and Refunds</h2>
        <p>
          Pro ($8/month) and Premium ($24/month) subscriptions are processed by{' '}
          <strong className="text-fg">Lemon Squeezy</strong>, a Merchant of
          Record that handles payment, tax, and invoicing globally.
          Subscriptions auto-renew until cancelled.
        </p>
        <p>
          <strong className="text-fg">
            All sales are final. Atrox does not offer refunds
          </strong>{' '}
          for subscriptions or digital content. You may cancel at any time via
          the customer portal provided by Lemon Squeezy; access continues until
          the end of your current billing period.
        </p>
      </section>

      <section>
        <h2>5. User Conduct</h2>
        <p>
          When commenting or interacting with the Service, you agree not to:
        </p>
        <ul>
          <li>Post illegal, harassing, or abusive content</li>
          <li>
            Attempt to extract, reverse-engineer, or jailbreak the AI system
          </li>
          <li>Use automated tools to scrape or abuse the Service</li>
          <li>Impersonate others or misrepresent your identity</li>
        </ul>
      </section>

      <section>
        <h2>6. DMCA Copyright Policy</h2>
        <p>
          If you believe content on Atrox infringes your copyright, send a DMCA
          takedown notice to{' '}
          <a
            href="mailto:marumonomon77@gmail.com"
            className="text-gold hover:text-gold-muted underline"
          >
            marumonomon77@gmail.com
          </a>{' '}
          including: (1) identification of the copyrighted work, (2) location of
          the infringing material, (3) your contact information, (4) a statement
          of good-faith belief, (5) a statement of accuracy under penalty of
          perjury, and (6) your signature.
        </p>
      </section>

      <section>
        <h2>7. Disclaimer of Warranties</h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; without warranties of any kind, express or implied,
          including merchantability, fitness for a particular purpose, or
          non-infringement.
        </p>
      </section>

      <section>
        <h2>8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Atrox&apos;s total liability
          arising out of or relating to these Terms or the Service shall not
          exceed the greater of (a) the amount you paid to Atrox in the twelve
          (12) months before the claim, or (b) US $100.
        </p>
      </section>

      <section>
        <h2>9. Dispute Resolution and Arbitration</h2>
        <p>
          Any dispute arising from these Terms shall first be attempted to be
          resolved informally by contacting us. If unresolved, you and Atrox
          agree to binding arbitration on an individual basis.
          <strong className="text-fg">
            {' '}
            You waive the right to participate in class actions or
            representative proceedings.
          </strong>
        </p>
      </section>

      <section>
        <h2>10. Governing Law and Jurisdiction</h2>
        <p>
          These Terms are governed by the laws of Japan, without regard to
          conflict of laws principles. Any disputes not subject to arbitration
          shall be resolved in the courts of Tokyo, Japan.
        </p>
      </section>

      <section>
        <h2>11. Force Majeure</h2>
        <p>
          Atrox is not liable for any failure or delay due to causes beyond
          reasonable control, including API outages, internet failures, or force
          majeure events.
        </p>
      </section>

      <section>
        <h2>12. Severability</h2>
        <p>
          If any provision of these Terms is found invalid or unenforceable, the
          remaining provisions shall continue in full force and effect.
        </p>
      </section>

      <section>
        <h2>13. Changes to These Terms</h2>
        <p>
          We may update these Terms periodically. Material changes will be
          notified via email to registered users or via a banner on the Service.
          Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>14. Entire Agreement</h2>
        <p>
          These Terms, together with our Privacy Policy, constitute the entire
          agreement between you and Atrox regarding the Service.
        </p>
      </section>

      <section>
        <h2>15. Contact</h2>
        <p>
          Questions about these Terms:{' '}
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
