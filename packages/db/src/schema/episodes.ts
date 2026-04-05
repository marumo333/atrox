import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { arcs } from './arcs'

export const episodes = pgTable('episodes', {
  id: uuid('id').defaultRandom().primaryKey(),
  arcId: uuid('arc_id')
    .references(() => arcs.id)
    .notNull(),
  episodeNumber: integer('episode_number').notNull(),
  title: text('title'),
  body: text('body').notNull(),
  tier: text('tier').notNull().default('free'),
  publishedAt: timestamp('published_at'),
})
