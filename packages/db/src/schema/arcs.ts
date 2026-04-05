import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { characters } from './characters'

export const arcs = pgTable('arcs', {
  id: uuid('id').defaultRandom().primaryKey(),
  characterId: uuid('character_id')
    .references(() => characters.id)
    .notNull(),
  arcNumber: integer('arc_number').notNull(),
  title: text('title').notNull(),
  status: text('status').notNull().default('draft'),
  premise: text('premise').notNull(),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
})
