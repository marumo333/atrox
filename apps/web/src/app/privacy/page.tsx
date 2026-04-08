import type { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'
import { privacySections } from './sections'

export const metadata: Metadata = {
  title: 'Privacy Policy — Atrox',
  description: 'Privacy policy for Atrox, GDPR and CCPA compliant.',
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updatedAt="April 7, 2026">
      {privacySections.map((section, i) => (
        <section key={i}>
          {section.title && <h2>{section.title}</h2>}
          {section.body}
        </section>
      ))}
    </LegalLayout>
  )
}
