import { config } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { eq } from 'drizzle-orm'
import * as schema from '../schema/index'
import { VESPER_PERSONA, VESPER_STYLE_RULES } from './vesper'
import {
  ARC_1_PREMISE,
  ARC_1_WORLD_STATE,
  ARC_1_ENTITIES,
  ARC_1_STYLE_DRIFT,
  ARC_1_EMOTIONAL_LOG,
} from './arc-1'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../../../../.env.local') })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Run `vercel env pull .env.local` first.',
  )
}

const sql = neon(databaseUrl)
const db = drizzle(sql, { schema })

async function main() {
  console.log('Seeding database...')

  const characterId = await seedCharacter()
  const arcId = await seedArc(characterId)
  await seedArcState(arcId)

  console.log('Done.')
}

async function seedCharacter(): Promise<string> {
  const existing = await db
    .select()
    .from(schema.characters)
    .where(eq(schema.characters.slug, 'vesper-black'))
    .limit(1)

  if (existing[0]) {
    console.log('Character vesper-black already exists, skipping.')
    return existing[0].id
  }

  const [character] = await db
    .insert(schema.characters)
    .values({
      slug: 'vesper-black',
      name: 'Vesper Black',
      genre: 'Dark Romantasy',
      personaPrompt: VESPER_PERSONA,
      styleRules: VESPER_STYLE_RULES,
    })
    .returning()

  if (!character) throw new Error('Failed to insert character')
  console.log(`Inserted character: ${character.id}`)
  return character.id
}

async function seedArc(characterId: string): Promise<string> {
  const existing = await db
    .select()
    .from(schema.arcs)
    .where(eq(schema.arcs.characterId, characterId))
    .limit(1)

  if (existing[0]) {
    console.log('Arc 1 already exists, skipping.')
    return existing[0].id
  }

  const [arc] = await db
    .insert(schema.arcs)
    .values({
      characterId,
      arcNumber: 1,
      title: 'The Court of Thorns',
      status: 'active',
      premise: ARC_1_PREMISE,
      startedAt: new Date(),
    })
    .returning()

  if (!arc) throw new Error('Failed to insert arc')
  console.log(`Inserted arc: ${arc.id}`)
  return arc.id
}

async function seedArcState(arcId: string): Promise<void> {
  const existing = await db
    .select()
    .from(schema.arcState)
    .where(eq(schema.arcState.arcId, arcId))
    .limit(1)

  if (existing[0]) {
    console.log('Arc state already exists, skipping.')
    return
  }

  await db.insert(schema.arcState).values({
    arcId,
    worldState: ARC_1_WORLD_STATE,
    recurringEntities: ARC_1_ENTITIES,
    styleDrift: ARC_1_STYLE_DRIFT,
    emotionalLog: ARC_1_EMOTIONAL_LOG,
    episodeCount: 0,
  })
  console.log('Inserted arc state')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
