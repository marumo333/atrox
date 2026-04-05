import { eq, and, lte, asc } from 'drizzle-orm'
import type { DbClient } from '../client'
import { episodes } from '../schema/index'

export async function getPublishedEpisodes(
  db: DbClient,
  arcId: string,
) {
  return db
    .select()
    .from(episodes)
    .where(
      and(
        eq(episodes.arcId, arcId),
        lte(episodes.publishedAt, new Date()),
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
      and(
        eq(episodes.arcId, arcId),
        eq(episodes.episodeNumber, episodeNumber),
      ),
    )
    .limit(1)

  return episode ?? null
}
