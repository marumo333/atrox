import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  tier: text('tier').notNull().default('free'),
  stripeCustomerId: text('stripe_customer_id'),
  subscribedAt: timestamp('subscribed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
