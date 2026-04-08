import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { characters } from './characters'

export const premiumCharacters = pgTable('premium_characters', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  characterId: uuid('character_id')
    .references(() => characters.id)
    .notNull(),
  customPrompt: text('custom_prompt'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
