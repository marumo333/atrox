import type { LegalSection } from '@/lib/legal'

export const billingAndConductSections: LegalSection[] = [
  {
    title: '4. Subscriptions, Billing, and Refunds',
    body: (
      <>
        <p>
          Pro ($8/mo) and Premium ($24/mo) subscriptions are processed by{' '}
          <strong className="text-fg">Lemon Squeezy</strong>, a Merchant of
          Record that handles payment, tax, and invoicing globally.
          Subscriptions auto-renew until cancelled.
        </p>
        <p>
          <strong className="text-fg">
            EU/UK consumers — Waiver of Withdrawal Right:
          </strong>{' '}
          Under Article 16(m) of the EU Consumer Rights Directive (2011/83/EU),
          by checking the box to agree to these Terms at account creation and
          expressly consenting to immediate access to digital content, you waive
          your 14-day right of withdrawal. The supply of digital content begins
          immediately upon subscription.
        </p>
        <p>
          <strong className="text-fg">
            All sales are final. Atrox does not offer refunds
          </strong>{' '}
          for subscriptions or digital content. You may cancel at any time via
          Lemon Squeezy&apos;s customer portal; access continues until the end
          of your current billing period.
        </p>
      </>
    ),
  },
  {
    title: '5. User Conduct',
    body: (
      <>
        <p>When using the Service, you agree not to:</p>
        <ul>
          <li>Post illegal, harassing, or abusive content</li>
          <li>
            Attempt to extract, reverse-engineer, or jailbreak the AI system
          </li>
          <li>Use automated tools to scrape or abuse the Service</li>
          <li>Impersonate others or misrepresent your identity</li>
        </ul>
      </>
    ),
  },
]
