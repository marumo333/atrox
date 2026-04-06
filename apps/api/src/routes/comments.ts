import { Hono } from 'hono'
import { db } from '@atrox/db'
import { comments } from '@atrox/db/schema'
import { eq } from 'drizzle-orm'
import type { Tier } from '@atrox/types'
import { WEIGHT_BY_TIER } from '@atrox/types'

export const commentsRouter = new Hono()

commentsRouter.get('/', async (c) => {
  const episodeId = c.req.query('episodeId')
  if (!episodeId) {
    return c.json({ error: 'episodeId is required' }, 400)
  }

  const result = await db
    .select()
    .from(comments)
    .where(eq(comments.episodeId, episodeId))

  return c.json({ comments: result })
})

commentsRouter.post('/', async (c) => {
  const body = await c.req.json<{ episodeId: string; body: string }>()

  if (!body.episodeId || !body.body) {
    return c.json({ error: 'episodeId and body are required' }, 400)
  }

  const userId = c.get('userId' as never) as string
  const userTier = (c.get('userTier' as never) as Tier) ?? 'free'

  await db.insert(comments).values({
    episodeId: body.episodeId,
    userId,
    body: body.body,
    weight: WEIGHT_BY_TIER[userTier],
  })

  return c.json({ success: true }, 201)
})
