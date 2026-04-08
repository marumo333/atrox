import type { Tier } from '@atrox/types'
import { getLemonVariantPro, getLemonVariantPremium } from './env-api'

/**
 * Maps a Lemon Squeezy variant ID to an Atrox tier.
 * LEMONSQUEEZY_VARIANT_PREMIUM is optional (Premium tier is not sold
 * in the MVP). When unset, premium variants cannot be purchased but
 * webhook handlers still recognize them gracefully.
 */
export function variantToTier(variantId: number | string): Tier {
  const id = String(variantId)
  const premium = getLemonVariantPremium()
  if (premium && id === premium) return 'premium'
  if (id === getLemonVariantPro()) return 'pro'
  return 'free'
}

/**
 * Returns true if the subscription grants access.
 * - on_trial / active / past_due → yes
 * - cancelled but still within ends_at → yes
 * - expired / unpaid / paused → no
 */
export function isEntitled(status: string, endsAt: string | null): boolean {
  if (status === 'on_trial' || status === 'active' || status === 'past_due') {
    return true
  }
  if (status === 'cancelled' && endsAt && new Date(endsAt) > new Date()) {
    return true
  }
  return false
}
