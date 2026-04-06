import { eq, and, lte, asc, inArray } from 'drizzle-orm'
import type { DbClient } from '../client'
import { episodes } from '../schema/index'
import type { Tier } from '@atrox/types'
import { TIER_ORDER } from '@atrox/types'

function getAllowedTiers(userTier: Tier): string[] {
  const level = TIER_ORDER[userTier]
  return Object.entries(TIER_ORDER)
    .filter(([, v]) => v <= level)
    .map(([k]) => k)
}

export async function getPublishedEpisodes(
  db: DbClient,
  arcId: string,
  userTier: Tier = 'free',
) {
  const allowed = getAllowedTiers(userTier)
  return db
    .select()
    .from(episodes)
    .where(
      and(
        eq(episodes.arcId, arcId),
        lte(episodes.publishedAt, new Date()),
        inArray(episodes.tier, allowed),
      ),
    )
    .orderBy(asc(episodes.episodeNumber))
}

export async function getEpisodeByNumber(
  db: DbClient,
  arcId: string,
  episodeNumber: number,
) {
  const [episode] = await db
    .select()
    .from(episodes)
    .where(
      and(eq(episodes.arcId, arcId), eq(episodes.episodeNumber, episodeNumber)),
    )
    .limit(1)

  return episode ?? null
}
