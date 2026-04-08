import { eq, and, lte, asc, desc } from 'drizzle-orm'
import type { DbClient } from '../client'
import { episodes } from '../schema/index'

/**
 * Returns all published episodes for an arc, ordered ascending.
 * Tier filtering is applied in JS by the caller using getEffectiveTier,
 * since early-access windows depend on wall-clock time and cannot be
 * easily expressed with a simple SQL IN clause.
 */
export async function getPublishedEpisodes(db: DbClient, arcId: string) {
  return db
    .select()
    .from(episodes)
    .where(
      and(eq(episodes.arcId, arcId), lte(episodes.publishedAt, new Date())),
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

/**
 * Returns all episodes for an arc (regardless of publish state),
 * ordered ascending. Used by the generation pipeline to feed prior
 * episodes into the Claude prompt for continuity.
 */
export async function getAllEpisodesForArc(db: DbClient, arcId: string) {
  return db
    .select({
      episodeNumber: episodes.episodeNumber,
      title: episodes.title,
      body: episodes.body,
    })
    .from(episodes)
    .where(eq(episodes.arcId, arcId))
    .orderBy(asc(episodes.episodeNumber))
}

/**
 * Returns IDs of the most recent N episodes for an arc, newest first.
 * Used to fetch reader comments on recent episodes for prompt injection.
 */
export async function getRecentEpisodeIds(
  db: DbClient,
  arcId: string,
  limit: number,
): Promise<string[]> {
  const rows = await db
    .select({ id: episodes.id })
    .from(episodes)
    .where(eq(episodes.arcId, arcId))
    .orderBy(desc(episodes.episodeNumber))
    .limit(limit)
  return rows.map((r) => r.id)
}
