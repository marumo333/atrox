import { config } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { eq, asc } from 'drizzle-orm'
import * as schema from '@atrox/db/schema'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../../../../.env.local') })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is not set')

const sql = neon(databaseUrl)
const db = drizzle(sql, { schema })

const episodeNumberArg = Number(process.argv[2] ?? '1')

async function main() {
  const rows = await db
    .select()
    .from(schema.episodes)
    .where(eq(schema.episodes.episodeNumber, episodeNumberArg))
    .orderBy(asc(schema.episodes.episodeNumber))
    .limit(1)

  const episode = rows[0]
  if (!episode) {
    console.error(`No episode found with number ${episodeNumberArg}`)
    process.exit(1)
  }

  const divider = '━'.repeat(60)
  console.log(divider)
  console.log(`  EPISODE ${episode.episodeNumber}`)
  if (episode.title) console.log(`  ${episode.title}`)
  console.log(`  tier: ${episode.tier}`)
  if (episode.publishedAt) {
    console.log(`  published: ${episode.publishedAt.toISOString()}`)
  }
  console.log(`  ${episode.body.length} characters`)
  console.log(divider)
  console.log()
  console.log(episode.body)
  console.log()
  console.log(divider)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
