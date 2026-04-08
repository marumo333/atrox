import { config } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { eq } from 'drizzle-orm'
import * as schema from '@atrox/db/schema'
import { runGenerationJob } from '../cron/generate'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../../../../.env.local') })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is not set')
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set')
}

const sql = neon(databaseUrl)
const db = drizzle(sql, { schema })

async function main() {
  console.log('Finding Vesper Black + active arc...')
  const [character] = await db
    .select()
    .from(schema.characters)
    .where(eq(schema.characters.slug, 'vesper-black'))
    .limit(1)
  if (!character)
    throw new Error('Character vesper-black not found. Run db:seed first.')

  const [arc] = await db
    .select()
    .from(schema.arcs)
    .where(eq(schema.arcs.characterId, character.id))
    .limit(1)
  if (!arc) throw new Error('Arc not found. Run db:seed first.')

  await ensurePendingJob(arc.id)
  console.log('Running generation job via Claude API...')

  const getCharacter = async () => ({
    personaPrompt: character.personaPrompt,
    styleRules: character.styleRules,
  })

  const result = await runGenerationJob(
    db as unknown as Parameters<typeof runGenerationJob>[0],
    getCharacter,
  )

  if (result.generated) {
    console.log('Episode generated successfully')
  } else {
    console.log('No pending job picked up')
  }
}

async function ensurePendingJob(arcId: string): Promise<void> {
  const [existing] = await db
    .select()
    .from(schema.agentQueue)
    .where(eq(schema.agentQueue.status, 'pending'))
    .limit(1)

  if (existing) {
    console.log('Pending job already exists, using it')
    return
  }

  await db.insert(schema.agentQueue).values({
    arcId,
    trigger: 'manual',
    status: 'pending',
    scheduledAt: new Date(),
  })
  console.log('Inserted new pending job')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
