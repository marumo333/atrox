import { desc, inArray } from 'drizzle-orm'
import type { DbClient } from '../client'
import { comments } from '../schema/index'

export async function getTopComments(
  db: DbClient,
  episodeIds: string[],
  limit = 5,
) {
  if (episodeIds.length === 0) return []

  return db
    .select()
    .from(comments)
    .where(inArray(comments.episodeId, episodeIds))
    .orderBy(desc(comments.weight), desc(comments.createdAt))
    .limit(limit)
}
