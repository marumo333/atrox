import { NextResponse } from 'next/server'
import { db, getCharacterBySlug } from '@atrox/db'
import { runGenerationJob } from '@atrox/agent'
import { timingSafeEqual } from 'node:crypto'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes — generation + save

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false

  const authHeader = req.headers.get('authorization') ?? ''
  const expected = `Bearer ${secret}`

  if (authHeader.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected))
}

/**
 * Weekly episode generation cron.
 * Scheduled via apps/web/vercel.json to run Mondays at 09:00 UTC.
 * Vercel automatically sends `Authorization: Bearer ${CRON_SECRET}`.
 */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Currently only one character (Vesper Black). Future: loop over active
  // characters with pending jobs.
  const character = await getCharacterBySlug(db, 'vesper-black')
  if (!character) {
    return NextResponse.json({ error: 'Character not found' }, { status: 500 })
  }

  const getCharacter = async () => ({
    personaPrompt: character.personaPrompt,
    styleRules: character.styleRules,
  })

  try {
    const result = await runGenerationJob(db, getCharacter)
    return NextResponse.json({
      ok: true,
      generated: result.generated,
      character: character.slug,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[cron/generate] failed:', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
