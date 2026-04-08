'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <span className="text-xs text-fg-muted tracking-widest">...</span>
  }

  if (session?.user) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="text-xs tracking-widest text-fg-muted hover:text-fg transition-colors uppercase"
      >
        Sign Out
      </button>
    )
  }

  return (
    <Link
      href="/login"
      className="border border-gold/40 px-4 py-1.5 text-xs tracking-widest text-gold hover:bg-gold/10 hover:border-gold transition-all uppercase"
    >
      Enter
    </Link>
  )
}
