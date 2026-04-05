import { pgTable, uuid, jsonb, integer, timestamp } from 'drizzle-orm/pg-core'
import { arcs } from './arcs'

export const arcState = pgTable('arc_state', {
  id: uuid('id').defaultRandom().primaryKey(),
  arcId: uuid('arc_id')
    .references(() => arcs.id)
    .notNull()
    .unique(),
  worldState: jsonb('world_state').notNull().default({}),
  recurringEntities: jsonb('recurring_entities').notNull().default({}),
  styleDrift: jsonb('style_drift').notNull().default([]),
  emotionalLog: jsonb('emotional_log').notNull().default([]),
  episodeCount: integer('episode_count').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
