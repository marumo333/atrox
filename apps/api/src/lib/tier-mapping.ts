import type { Tier } from '@atrox/types'
import { getEnv } from './env'

export function variantToTier(variantId: number | string): Tier {
  const env = getEnv()
  const id = String(variantId)
  if (id === env.LEMONSQUEEZY_VARIANT_PREMIUM) return 'premium'
  if (id === env.LEMONSQUEEZY_VARIANT_PRO) return 'pro'
  return 'free'
}

export function isEntitled(status: string, endsAt: string | null): boolean {
  if (status === 'on_trial' || status === 'active' || status === 'past_due') {
    return true
  }
  if (status === 'cancelled' && endsAt && new Date(endsAt) > new Date()) {
    return true
  }
  return false
}
