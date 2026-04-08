import type { LegalSection } from '@/lib/legal'
import { MailTo } from '@/lib/legal'

export const rightsMiscSections: LegalSection[] = [
  {
    title: '8. Your Rights',
    body: (
      <>
        <p>Depending on your jurisdiction, you may:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion (right to be forgotten)</li>
          <li>Restrict or object to certain processing</li>
          <li>Request data portability</li>
          <li>Withdraw consent at any time</li>
          <li>Lodge a complaint with your local supervisory authority</li>
        </ul>
        <p>
          <strong className="text-fg">California residents (CCPA/CPRA):</strong>{' '}
          You have the right to know, delete, correct, opt out of sale/sharing,
          and <em>limit the use of sensitive personal information</em>. Atrox
          does not sell personal information and does not process sensitive
          personal information for targeted advertising.
        </p>
        <p>
          To exercise rights, email <MailTo />. We respond within 30 days.
        </p>
      </>
    ),
  },
  {
    title: '9. Automated Processing',
    body: (
      <p>
        Atrox uses Claude to generate episodes based on aggregated reader
        comments. This is creative content generation — not automated
        decision-making with legal or similarly significant effects under GDPR
        Article 22.
      </p>
    ),
  },
  {
    title: '10. Security',
    body: (
      <p>
        Passwords are hashed with bcrypt (cost 12). All traffic is HTTPS.
        Sessions use signed JWTs. Webhooks are HMAC-verified. In the event of a
        personal data breach affecting EU/UK users, we will notify the relevant
        supervisory authority within 72 hours and affected users without undue
        delay (GDPR Articles 33 and 34).
      </p>
    ),
  },
  {
    title: '11. Age Restrictions',
    body: (
      <p>
        Atrox is restricted to users{' '}
        <strong className="text-fg">18 years and older</strong>. We do not
        knowingly collect personal information from anyone under 18, and
        specifically not from children under 13 (COPPA). If you believe a minor
        has provided us with data, contact us for immediate deletion.
      </p>
    ),
  },
  {
    title: '12. Changes to This Policy',
    body: (
      <p>
        Material changes will be announced at least 30 days in advance via email
        to registered users or via a banner on the Service. The effective date
        at the top of this policy reflects the most recent update.
      </p>
    ),
  },
  {
    title: '13. Contact',
    body: (
      <p>
        For privacy questions or to exercise your rights: <MailTo />
      </p>
    ),
  },
]
