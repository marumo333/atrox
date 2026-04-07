import type { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'
import { termsSections } from './sections'

export const metadata: Metadata = {
  title: 'Terms of Service — Atrox',
  description: 'Terms of service for Atrox, an AI serial fiction platform.',
}

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updatedAt="April 7, 2026">
      {termsSections.map((section, i) => (
        <section key={i}>
          {section.title && <h2>{section.title}</h2>}
          {section.body}
        </section>
      ))}
    </LegalLayout>
  )
}
