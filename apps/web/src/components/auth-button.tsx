'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <span className="text-sm text-muted-foreground">...</span>
  }

  if (session?.user) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="rounded border border-muted px-4 py-1.5 text-sm hover:border-muted-foreground"
      >
        Sign Out
      </button>
    )
  }

  return (
    <Link
      href="/login"
      className="rounded bg-accent px-4 py-1.5 text-sm text-foreground hover:bg-accent-light"
    >
      Sign In
    </Link>
  )
}
