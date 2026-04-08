import type { LegalSection } from '@/lib/legal'
import { MailTo } from '@/lib/legal'

export const boilerplateSections: LegalSection[] = [
  {
    title: '11. Force Majeure',
    body: (
      <p>
        Atrox is not liable for delays or failures due to causes beyond
        reasonable control, including API outages, infrastructure failures, or
        force majeure events.
      </p>
    ),
  },
  {
    title: '12. Severability',
    body: (
      <p>
        If any provision of these Terms is found invalid, the remaining
        provisions shall continue in full force and effect.
      </p>
    ),
  },
  {
    title: '13. Changes to These Terms',
    body: (
      <p>
        We may update these Terms periodically. Material changes will be
        announced at least 30 days in advance via email to registered users or
        via a banner on the Service. Continued use after the effective date
        constitutes acceptance.
      </p>
    ),
  },
  {
    title: '14. Entire Agreement',
    body: (
      <p>
        These Terms, together with our Privacy Policy, constitute the entire
        agreement between you and Atrox regarding the Service.
      </p>
    ),
  },
  {
    title: '15. Contact',
    body: (
      <p>
        Questions about these Terms: <MailTo />
      </p>
    ),
  },
]
