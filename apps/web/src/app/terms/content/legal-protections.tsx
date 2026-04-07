import type { LegalSection } from '@/lib/legal'
import { MailTo } from '@/lib/legal'

export const legalProtectionSections: LegalSection[] = [
  {
    title: '6. DMCA Copyright Policy',
    body: (
      <p>
        Send takedown notices to <MailTo /> including: identification of the
        copyrighted work, location of infringing material, your contact
        information, a statement of good-faith belief, a statement of accuracy
        under penalty of perjury, and your signature.
      </p>
    ),
  },
  {
    title: '7. Disclaimer of Warranties',
    body: (
      <p>
        The Service is provided &ldquo;as is&rdquo; without warranties of any
        kind, except where prohibited by applicable consumer protection law.
      </p>
    ),
  },
  {
    title: '8. Limitation of Liability',
    body: (
      <p>
        To the fullest extent permitted by law, Atrox&apos;s total liability
        shall not exceed the greater of (a) the amount you paid in the twelve
        (12) months before the claim, or (b) US $100.{' '}
        <strong className="text-fg">
          Nothing in these Terms limits liability that cannot be limited under
          applicable law, including liability for gross negligence, willful
          misconduct, or statutory consumer rights.
        </strong>
      </p>
    ),
  },
  {
    title: '9. Dispute Resolution',
    body: (
      <>
        <p>
          Disputes should first be attempted to be resolved informally by
          contacting <MailTo />. For unresolved disputes, binding arbitration
          applies on an individual basis. You waive the right to class actions.
        </p>
        <p>
          <strong className="text-fg">EU/UK consumers exception:</strong>{' '}
          Mandatory arbitration and class action waivers do not apply to
          consumers residing in the EU, UK, or other jurisdictions where such
          waivers are prohibited by law. EU consumers may bring disputes before
          the courts of their country of residence and may use the EU Online
          Dispute Resolution platform at ec.europa.eu/consumers/odr.
        </p>
      </>
    ),
  },
  {
    title: '10. Governing Law',
    body: (
      <p>
        These Terms are governed by the laws of Japan. Disputes shall be
        resolved in the courts of Tokyo, Japan.{' '}
        <strong className="text-fg">
          If you are a consumer resident in the EU or UK, the mandatory consumer
          protection provisions of your country of residence take precedence
          where they provide greater protection.
        </strong>
      </p>
    ),
  },
]
