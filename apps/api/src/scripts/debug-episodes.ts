import { config } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { eq, and, lte, asc } from 'drizzle-orm'
import * as schema from '@atrox/db/schema'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../../../../.env.local') })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is not set')

console.log(
  'Using DATABASE_URL:',
  databaseUrl.slice(0, 40) + '...' + databaseUrl.slice(-20),
)
console.log()

const sql = neon(databaseUrl)
const db = drizzle(sql, { schema })

async function main() {
  // 1. Check character
  console.log('── 1. Character ──')
  const characters = await db.select().from(schema.characters)
  console.log(`Total characters: ${characters.length}`)
  characters.forEach((c) => {
    console.log(`  - ${c.slug}: ${c.name} (id: ${c.id})`)
  })
  console.log()

  // 2. Check arcs
  console.log('── 2. Arcs ──')
  const arcs = await db.select().from(schema.arcs)
  console.log(`Total arcs: ${arcs.length}`)
  arcs.forEach((a) => {
    console.log(
      `  - Arc ${a.arcNumber}: ${a.title} | status=${a.status} | characterId=${a.characterId}`,
    )
  })
  console.log()

  // 3. Check episodes
  console.log('── 3. Episodes ──')
  const allEpisodes = await db
    .select({
      episodeNumber: schema.episodes.episodeNumber,
      title: schema.episodes.title,
      tier: schema.episodes.tier,
      publishedAt: schema.episodes.publishedAt,
      bodyLen: schema.episodes.body,
      arcId: schema.episodes.arcId,
    })
    .from(schema.episodes)
    .orderBy(asc(schema.episodes.episodeNumber))

  console.log(`Total episodes: ${allEpisodes.length}`)
  allEpisodes.forEach((e) => {
    const isPublished = e.publishedAt && e.publishedAt <= new Date()
    console.log(
      `  - #${e.episodeNumber} | tier=${e.tier} | publishedAt=${e.publishedAt?.toISOString() ?? 'NULL'} | isPublished=${isPublished} | bodyLen=${e.bodyLen.length} | arcId=${e.arcId}`,
    )
  })
  console.log()

  // 4. Run the exact query that getPublishedEpisodes uses
  console.log('── 4. getPublishedEpisodes simulation ──')
  if (arcs[0]) {
    const now = new Date()
    console.log(`  now = ${now.toISOString()}`)
    const published = await db
      .select()
      .from(schema.episodes)
      .where(
        and(
          eq(schema.episodes.arcId, arcs[0].id),
          lte(schema.episodes.publishedAt, now),
        ),
      )
      .orderBy(asc(schema.episodes.episodeNumber))
    console.log(
      `  Published episodes for arc ${arcs[0].id}: ${published.length}`,
    )
  }
  console.log()

  // 5. Check users
  console.log('── 5. Users ──')
  const users = await db.select().from(schema.users)
  console.log(`Total users: ${users.length}`)
  users.forEach((u) => {
    console.log(`  - ${u.email} | tier=${u.tier} | id=${u.id}`)
  })
  console.log()

  // 6. getActiveArc simulation
  console.log('── 6. getActiveArc simulation ──')
  if (characters[0]) {
    const activeArcs = await db
      .select()
      .from(schema.arcs)
      .where(
        and(
          eq(schema.arcs.characterId, characters[0].id),
          eq(schema.arcs.status, 'active'),
        ),
      )
    console.log(`  Active arcs for ${characters[0].slug}: ${activeArcs.length}`)
    activeArcs.forEach((a) => {
      console.log(`    - Arc ${a.arcNumber}: ${a.title}`)
    })
  }
  console.log()

  console.log('── DIAGNOSTIC COMPLETE ──')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
