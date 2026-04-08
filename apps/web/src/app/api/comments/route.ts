import { NextResponse } from 'next/server'
import { eq, desc } from 'drizzle-orm'
import { db, schema } from '@atrox/db'
import { auth } from '@/lib/auth'
import { WEIGHT_BY_TIER } from '@atrox/types'
import type { Tier } from '@atrox/types'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const episodeId = url.searchParams.get('episodeId')
  if (!episodeId) {
    return NextResponse.json(
      { error: 'episodeId is required' },
      { status: 400 },
    )
  }

  const rows = await db
    .select({
      id: schema.comments.id,
      body: schema.comments.body,
      weight: schema.comments.weight,
      createdAt: schema.comments.createdAt,
    })
    .from(schema.comments)
    .where(eq(schema.comments.episodeId, episodeId))
    .orderBy(desc(schema.comments.createdAt))

  return NextResponse.json({ comments: rows })
}

export async function POST(req: Request) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as { episodeId?: string; body?: string }
  if (!body.episodeId || !body.body) {
    return NextResponse.json(
      { error: 'episodeId and body are required' },
      { status: 400 },
    )
  }

  if (body.body.length > 500) {
    return NextResponse.json(
      { error: 'Comment must be 500 characters or fewer' },
      { status: 400 },
    )
  }

  // Read live tier from DB (not JWT) for accurate weight
  const [user] = await db
    .select({ tier: schema.users.tier })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1)

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const userTier = user.tier as Tier
  const weight = WEIGHT_BY_TIER[userTier] ?? 1

  await db.insert(schema.comments).values({
    episodeId: body.episodeId,
    userId,
    body: body.body,
    weight,
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
