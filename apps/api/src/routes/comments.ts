import { Hono } from 'hono'
import { db } from '@atrox/db'
import { comments, users } from '@atrox/db/schema'
import { eq } from 'drizzle-orm'
import type { Tier } from '@atrox/types'
import { WEIGHT_BY_TIER } from '@atrox/types'
import { auth } from '../middleware/auth'

export const commentsRouter = new Hono()

// GET is public — anyone can read comments on an episode
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

// POST requires authentication and applies tier-based weight
commentsRouter.post('/', auth(), async (c) => {
  const body = await c.req.json<{ episodeId: string; body: string }>()

  if (!body.episodeId || !body.body) {
    return c.json({ error: 'episodeId and body are required' }, 400)
  }

  const userId = c.get('userId' as never) as string
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // Read live tier from DB (not JWT) to avoid stale weight after upgrades
  const [user] = await db
    .select({ tier: users.tier })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  const userTier = user.tier as Tier
  const weight = WEIGHT_BY_TIER[userTier] ?? 1

  await db.insert(comments).values({
    episodeId: body.episodeId,
    userId,
    body: body.body,
    weight,
  })

  return c.json({ success: true }, 201)
})
