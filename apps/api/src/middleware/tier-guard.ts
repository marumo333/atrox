import { createMiddleware } from 'hono/factory'
import { db } from '@atrox/db'
import { users } from '@atrox/db/schema'
import { eq } from 'drizzle-orm'
import type { Tier } from '@atrox/types'
import { TIER_ORDER } from '@atrox/types'

export const tierGuard = (required: Tier) =>
  createMiddleware(async (c, next) => {
    const userId = c.get('userId' as never) as string | undefined
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const [user] = await db
      .select({ tier: users.tier })
      .from(users)
      .where(eq(users.id, userId))

    if (!user) return c.json({ error: 'User not found' }, 404)

    const userTier = user.tier as Tier
    const userLevel = TIER_ORDER[userTier] ?? 0
    const requiredLevel = TIER_ORDER[required]

    if (userLevel < requiredLevel) {
      return c.json({ error: 'Upgrade required', required }, 403)
    }

    c.set('userTier' as never, userTier as never)
    await next()
  })

// Lightweight version for tests (no DB lookup)
export const tierGuardSimple = (required: Tier) =>
  createMiddleware(async (c, next) => {
    const userTier = (c.get('userTier' as never) as Tier) ?? 'free'
    const userLevel = TIER_ORDER[userTier]
    const requiredLevel = TIER_ORDER[required]

    if (userLevel < requiredLevel) {
      return c.json({ error: 'Upgrade required', required }, 403)
    }

    await next()
  })
