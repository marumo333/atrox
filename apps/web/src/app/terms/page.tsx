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
          be bound by these Terms of Service. If you do not agree, do not use
          the Service.
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
          a human author. We disclose this clearly to ensure you understand the
          nature of the content.
        </p>
        <p>
          AI-generated content may occasionally produce unexpected,
          inconsistent, or offensive output. While we use guardrails and review
          processes, we cannot guarantee perfection.
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
            Reader comments you submit grant Atrox a non-exclusive license to
            use them as input for future episode generation
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Subscriptions and Refunds</h2>
        <p>
          Pro ($8/month) and Premium ($24/month) subscriptions are billed
          monthly via Stripe. Subscriptions auto-renew until cancelled.
        </p>
        <p>
          <strong className="text-fg">
            All sales are final. Atrox does not offer refunds
          </strong>{' '}
          for subscriptions or digital content, consistent with the nature of
          delivered AI-generated works. You may cancel at any time; access
          continues until the end of your current billing period.
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
        <h2>6. Account Termination</h2>
        <p>
          Atrox reserves the right to suspend or terminate accounts that violate
          these terms, without refund.
        </p>
      </section>

      <section>
        <h2>7. Disclaimer of Warranties</h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; without warranties of any
          kind. Atrox is not liable for any damages arising from your use of the
          Service.
        </p>
      </section>

      <section>
        <h2>8. Changes to These Terms</h2>
        <p>
          We may update these Terms periodically. Continued use of the Service
          after changes constitutes acceptance of the new terms.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          For questions about these Terms, contact us via the email address
          listed in the Privacy Policy.
        </p>
      </section>
    </LegalLayout>
  )
}
