import { auth } from './auth'
import { db } from '@atrox/db'
import { users } from '@atrox/db/schema'
import { eq } from 'drizzle-orm'
import type { Tier } from '@atrox/types'

/**
 * Resolves the current user's subscription tier from the session.
 * Returns 'free' for unauthenticated users or users without a session.
 * Queries the DB for the current tier (not the JWT) to avoid staleness.
 */
export async function getCurrentTier(): Promise<Tier> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return 'free'

  const [user] = await db
    .select({ tier: users.tier })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  return ((user?.tier as Tier) ?? 'free') satisfies Tier
}
