import type { ReactNode } from 'react'

export const LEGAL_EMAIL = 'marumonomon77@gmail.com'

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
