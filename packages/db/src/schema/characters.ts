import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const characters = pgTable('characters', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  genre: text('genre').notNull(),
  personaPrompt: text('persona_prompt').notNull(),
  styleRules: text('style_rules').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
