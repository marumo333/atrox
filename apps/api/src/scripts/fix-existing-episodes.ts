import { config } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { eq } from 'drizzle-orm'
import * as schema from '@atrox/db/schema'
import { parseEpisode } from '@atrox/agent'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../../../../.env.local') })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is not set')

const sql = neon(databaseUrl)
const db = drizzle(sql, { schema })

async function main() {
  console.log('Re-parsing existing episodes...')

  const all = await db.select().from(schema.episodes)
  console.log(`Found ${all.length} episodes`)

  for (const ep of all) {
    const parsed = parseEpisode(ep.body)
    console.log(
      `  Episode ${ep.episodeNumber}: title="${parsed.title}" bodyLen=${parsed.body.length} (was ${ep.body.length})`,
    )

    await db
      .update(schema.episodes)
      .set({
        title: parsed.title,
        body: parsed.body,
      })
      .where(eq(schema.episodes.id, ep.id))
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
