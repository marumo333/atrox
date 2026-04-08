import type { ReactNode } from 'react'

/**
 * Legal contact email — sourced from env at build time.
 * Falls back to the documented address for local development.
 */
export const LEGAL_EMAIL =
  process.env.NEXT_PUBLIC_LEGAL_EMAIL ?? 'marumonomon77@gmail.com'

export function MailTo() {
  return (
    <a
      href={`mailto:${LEGAL_EMAIL}`}
      className="text-gold hover:text-gold-muted underline"
    >
      {LEGAL_EMAIL}
    </a>
  )
}

export interface LegalSection {
  title: string | null
  body: ReactNode
}
