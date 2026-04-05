import { createMiddleware } from 'hono/factory'
import type { Tier } from '@atrox/types'
import { TIER_ORDER } from '@atrox/types'

export const tierGuardSimple = (required: Tier) =>
  createMiddleware(async (c, next) => {
    const userTier = c.get('userTier' as never) as Tier | undefined

    const userLevel = TIER_ORDER[userTier ?? 'free']
    const requiredLevel = TIER_ORDER[required]

    if (userLevel < requiredLevel) {
      return c.json({ error: 'Upgrade required', required }, 403)
    }

    await next()
  })
