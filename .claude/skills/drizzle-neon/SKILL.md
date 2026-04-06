---
name: drizzle-neon
description: Drizzle ORM + Neon（PostgreSQL）の実装で使う。スキーマ定義、マイグレーション、クエリパターン、Neonのサーバーレス接続設定が含まれる作業では必ずこのスキルを参照すること。
---

# Drizzle ORM + Neon 実装ガイド

## セットアップ

```bash
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

---

## Neon接続設定

```ts
// packages/db/src/client.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
export type DbClient = typeof db
```

---

## スキーマ定義（全テーブル）

```ts
// packages/db/src/schema.ts
import {
  pgTable, uuid, text, integer, timestamp, jsonb
} from 'drizzle-orm/pg-core'

export const characters = pgTable('characters', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  genre: text('genre').notNull(),
  personaPrompt: text('persona_prompt').notNull(),
  styleRules: text('style_rules').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const arcs = pgTable('arcs', {
  id: uuid('id').defaultRandom().primaryKey(),
  characterId: uuid('character_id').references(() => characters.id).notNull(),
  arcNumber: integer('arc_number').notNull(),
  title: text('title').notNull(),
  status: text('status').notNull().default('draft'), // draft | active | completed
  premise: text('premise').notNull(),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
})

export const arcState = pgTable('arc_state', {
  id: uuid('id').defaultRandom().primaryKey(),
  arcId: uuid('arc_id').references(() => arcs.id).notNull().unique(),
  worldState: jsonb('world_state').notNull().default({}),
  recurringEntities: jsonb('recurring_entities').notNull().default({}),
  styleDrift: jsonb('style_drift').notNull().default([]),
  emotionalLog: jsonb('emotional_log').notNull().default([]),
  episodeCount: integer('episode_count').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const episodes = pgTable('episodes', {
  id: uuid('id').defaultRandom().primaryKey(),
  arcId: uuid('arc_id').references(() => arcs.id).notNull(),
  episodeNumber: integer('episode_number').notNull(),
  title: text('title'),
  body: text('body').notNull(),
  tier: text('tier').notNull().default('free'), // free | pro | premium
  publishedAt: timestamp('published_at'),
})

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  tier: text('tier').notNull().default('free'), // free | pro | premium
  stripeCustomerId: text('stripe_customer_id'),
  subscribedAt: timestamp('subscribed_at'),
})

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  episodeId: uuid('episode_id').references(() => episodes.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  body: text('body').notNull(),
  weight: integer('weight').notNull().default(1), // free=1, pro=2, premium=3
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const agentQueue = pgTable('agent_queue', {
  id: uuid('id').defaultRandom().primaryKey(),
  arcId: uuid('arc_id').references(() => arcs.id).notNull(),
  trigger: text('trigger').notNull(), // cron_weekly | manual
  inputSnapshot: jsonb('input_snapshot'),
  status: text('status').notNull().default('pending'), // pending | running | done | failed
  scheduledAt: timestamp('scheduled_at').notNull(),
})

export const premiumCharacters = pgTable('premium_characters', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  characterId: uuid('character_id').references(() => characters.id).notNull(),
  customPrompt: text('custom_prompt'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

---

## drizzle.config.ts

```ts
// packages/db/drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

---

## マイグレーションコマンド

```bash
# マイグレーションファイル生成
pnpm drizzle-kit generate

# DBに適用
pnpm drizzle-kit migrate

# スキーマ確認
pnpm drizzle-kit studio
```

---

## クエリパターン

```ts
// packages/db/src/queries/episodes.ts
import { db } from '../client'
import { episodes } from '../schema'
import { eq, lte, and } from 'drizzle-orm'

// tierに応じたエピソード取得
export async function getEpisodesByTier(
  arcId: string,
  userTier: 'free' | 'pro' | 'premium',
) {
  const tierOrder = { free: 0, pro: 1, premium: 2 }
  const allowedTiers = Object.entries(tierOrder)
    .filter(([, v]) => v <= tierOrder[userTier])
    .map(([k]) => k)

  return db
    .select()
    .from(episodes)
    .where(
      and(
        eq(episodes.arcId, arcId),
        // publishedAt が過去のもののみ
        lte(episodes.publishedAt, new Date()),
      )
    )
    .orderBy(episodes.episodeNumber)
}
```

---

## 注意事項

- Neonはサーバーレス接続のため、接続プールは使わない（`@neondatabase/serverless`が管理）
- トランザクションは`db.transaction(async (tx) => {...})`で書く
- マイグレーションファイルは手編集しない（`drizzle-kit generate`のみ）
- jsonbカラムはTypeScriptの型を`packages/types`で定義して共有する