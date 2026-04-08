import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'
import { resolve } from 'node:path'

// Load .env.local from the monorepo root (2 levels up from packages/db)
config({ path: resolve(__dirname, '../../.env.local') })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Run `vercel env pull .env.local` first.',
  )
}

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
})
