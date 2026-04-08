import type { Tier } from '@atrox/types'

export const EARLY_ACCESS_DAYS = 3
const EARLY_ACCESS_MS = EARLY_ACCESS_DAYS * 24 * 60 * 60 * 1000

interface EpisodeLike {
  tier: string
  publishedAt: Date | null
}

/**
 * Computes the effective tier of an episode based on release age.
 *
 * Business rule (PRD §4.1-4.2):
 * - All archived episodes are free to everyone
 * - New episodes are Pro-only for the first 3 days (early access)
 * - After 3 days, they automatically become free
 *
 * The stored `tier` column represents the early-access tier
 * (usually 'pro'). After the early access window passes, we
 * return 'free' regardless of stored value.
 */
export function getEffectiveTier(episode: EpisodeLike): Tier {
  if (!episode.publishedAt) return 'pro'

  const releasedAt = episode.publishedAt.getTime()
  const freeAt = releasedAt + EARLY_ACCESS_MS

  if (Date.now() >= freeAt) return 'free'
  return episode.tier as Tier
}

/** Returns the date when an episode becomes free to everyone. */
export function getFreeReleaseDate(publishedAt: Date | null): Date | null {
  if (!publishedAt) return null
  return new Date(publishedAt.getTime() + EARLY_ACCESS_MS)
}
