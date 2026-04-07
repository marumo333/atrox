import type { LegalSection } from '@/lib/legal'
import { MailTo } from '@/lib/legal'

export const introCollectionSections: LegalSection[] = [
  {
    title: null,
    body: (
      <>
        <p>
          This Privacy Policy describes how Atrox collects, uses, and protects
          your personal information. We comply with the EU and UK General Data
          Protection Regulations (GDPR) and the California Consumer Privacy Act
          (CCPA/CPRA).
        </p>
        <p>
          <strong className="text-fg">Data Controller:</strong>{' '}
          &ldquo;Atrox&rdquo;, a trading name used by an individual sole
          proprietor based in Japan. For all data protection inquiries, contact{' '}
          <MailTo />.
        </p>
      </>
    ),
  },
  {
    title: '1. Information We Collect',
    body: (
      <ul>
        <li>
          <strong className="text-fg">Account data:</strong> email address and
          bcrypt-hashed password (cost factor 12)
        </li>
        <li>
          <strong className="text-fg">Subscription data:</strong> Lemon Squeezy
          customer ID, subscription tier, subscription status. Card numbers and
          billing addresses are handled entirely by Lemon Squeezy and never
          stored by us
        </li>
        <li>
          <strong className="text-fg">Comments:</strong> text you voluntarily
          submit on episodes
        </li>
        <li>
          <strong className="text-fg">Technical data:</strong> IP address, user
          agent, timestamps (server logs)
        </li>
      </ul>
    ),
  },
  {
    title: '2. Legal Basis (GDPR Art. 6)',
    body: (
      <ul>
        <li>
          <strong className="text-fg">Contract (Art. 6(1)(b)):</strong> account
          creation, subscription delivery, episode access
        </li>
        <li>
          <strong className="text-fg">
            Legitimate interest (Art. 6(1)(f)):
          </strong>{' '}
          security logging, rate-limiting, fraud prevention, service improvement
        </li>
        <li>
          <strong className="text-fg">Consent (Art. 6(1)(a)):</strong> age
          confirmation, ToS agreement, digital content delivery waiver
        </li>
        <li>
          <strong className="text-fg">Legal obligation (Art. 6(1)(c)):</strong>{' '}
          tax records, compliance with lawful requests
        </li>
      </ul>
    ),
  },
  {
    title: '3. How We Use Your Information',
    body: (
      <>
        <ul>
          <li>Provide tier-based access to episodes</li>
          <li>
            Aggregate reader comments to inform AI-generated episode direction
          </li>
          <li>Process subscriptions via Lemon Squeezy</li>
          <li>
            Detect abuse and fraud via server logs and rate-limiting (retained
            up to 30 days)
          </li>
          <li>Respond to support inquiries</li>
        </ul>
        <p>
          We do not sell or share personal information for marketing purposes.
        </p>
      </>
    ),
  },
]
