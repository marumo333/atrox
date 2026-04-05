import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { arcs } from './arcs'

export const agentQueue = pgTable('agent_queue', {
  id: uuid('id').defaultRandom().primaryKey(),
  arcId: uuid('arc_id')
    .references(() => arcs.id)
    .notNull(),
  trigger: text('trigger').notNull(),
  inputSnapshot: jsonb('input_snapshot'),
  status: text('status').notNull().default('pending'),
  errorLog: text('error_log'),
  scheduledAt: timestamp('scheduled_at').notNull(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
})
