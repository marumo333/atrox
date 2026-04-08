import type { LegalSection } from '@/lib/legal'

export const transfersRetentionSections: LegalSection[] = [
  {
    title: '4. Third-Party Services and Locations',
    body: (
      <ul>
        <li>
          <strong className="text-fg">Lemon Squeezy (United States):</strong>{' '}
          Merchant of Record — all payment processing and global tax handling (
          <a
            href="https://www.lemonsqueezy.com/privacy"
            className="text-gold hover:text-gold-muted underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy
          </a>
          )
        </li>
        <li>
          <strong className="text-fg">Anthropic (United States):</strong> Claude
          API for AI content generation. Reader comments may be sent as prompt
          input
        </li>
        <li>
          <strong className="text-fg">Vercel (United States):</strong> hosting
          and edge infrastructure
        </li>
        <li>
          <strong className="text-fg">Neon (United States):</strong> PostgreSQL
          database hosting
        </li>
      </ul>
    ),
  },
  {
    title: '5. International Data Transfers',
    body: (
      <>
        <p>
          All sub-processors listed above are located in the United States. For
          transfers from the EU/UK, we rely on:
        </p>
        <ul>
          <li>
            <strong className="text-fg">
              EU-US Data Privacy Framework (DPF):
            </strong>{' '}
            where the sub-processor is certified under the DPF (adequacy
            decision of July 2023)
          </li>
          <li>
            <strong className="text-fg">
              Standard Contractual Clauses (SCCs):
            </strong>{' '}
            where DPF is not applicable
          </li>
        </ul>
      </>
    ),
  },
  {
    title: '6. Cookies and Tracking',
    body: (
      <p>
        We use{' '}
        <strong className="text-fg">only strictly necessary cookies</strong> for
        authenticated sessions (NextAuth JWT). No tracking, no advertising, no
        analytics. Do Not Track signals are respected by default. No consent
        banner is required under EU ePrivacy rules for strictly necessary
        cookies.
      </p>
    ),
  },
  {
    title: '7. Data Retention',
    body: (
      <ul>
        <li>
          <strong className="text-fg">Account data:</strong> retained while
          account is active; removed within 30 days of deletion request
        </li>
        <li>
          <strong className="text-fg">Comments:</strong> retained for the
          lifetime of the related story arc (to preserve narrative context);
          deletable on request
        </li>
        <li>
          <strong className="text-fg">Subscription records:</strong> retained
          for 7 years for tax compliance
        </li>
        <li>
          <strong className="text-fg">Server logs:</strong> maximum 30 days
        </li>
      </ul>
    ),
  },
]
