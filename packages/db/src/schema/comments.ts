import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { episodes } from './episodes'
import { users } from './users'

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  episodeId: uuid('episode_id')
    .references(() => episodes.id)
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  body: text('body').notNull(),
  weight: integer('weight').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
