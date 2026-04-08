'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { pollTierUpdate } from '@/lib/poll-tier-update'

/**
 * Mounts on /episodes. When the URL contains ?upgraded=true (set by the
 * Lemon Squeezy checkout redirect), refreshes the JWT session repeatedly
 * until the webhook lands and the tier flips to a paid value, then strips
 * the query param so a refresh doesn't re-trigger.
 */
export function UpgradeHandler() {
  const params = useSearchParams()
  const router = useRouter()
  const { data: session, update } = useSession()
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    if (params.get('upgraded') !== 'true') return
    ranRef.current = true

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms))

    void pollTierUpdate({
      update: () => update(),
      getCurrentTier: () =>
        (session?.user as { tier?: string } | undefined)?.tier,
      sleep,
      maxAttempts: 4,
      intervalMs: 1500,
    }).finally(() => {
      router.replace('/episodes')
    })
  }, [params, router, update, session])

  return null
}
