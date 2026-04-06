---
name: stripe-tier
description: StripeサブスクリプションとFree/Pro/Premiumのtier管理を実装するときに使う。Webhookの処理、tier判定ミドルウェア、Stripe製品設定が含まれる作業では必ずこのスキルを参照すること。
---

# Stripe Tier管理 実装ガイド

## Stripe製品設定（Stripeダッシュボードで手動設定）

```
Product: Atrox Pro
  Price: $8.00 / month (recurring)
  Price ID: price_pro_monthly → .envに STRIPE_PRO_PRICE_ID として保存

Product: Atrox Premium
  Price: $24.00 / month (recurring)
  Price ID: price_premium_monthly → .envに STRIPE_PREMIUM_PRICE_ID として保存
```

---

## 必要な環境変数

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
```

---

## Webhookルート（必ずここで全tier更新を処理する）

```ts
// apps/api/src/routes/webhooks.ts
import Stripe from 'stripe'
import { db } from '@atrox/db'
import { users } from '@atrox/db/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const webhookRoute = async (c: Context) => {
  const sig = c.req.header('stripe-signature')!
  const body = await c.req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch {
    return c.json({ error: 'Invalid signature' }, 400)
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const tier = resolveTier(sub)
      const customerId = sub.customer as string

      await db
        .update(users)
        .set({ tier, subscribedAt: new Date() })
        .where(eq(users.stripeCustomerId, customerId))
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await db
        .update(users)
        .set({ tier: 'free' })
        .where(eq(users.stripeCustomerId, sub.customer as string))
      break
    }
  }

  return c.json({ received: true })
}

// priceIdからtierを解決する
function resolveTier(sub: Stripe.Subscription): 'pro' | 'premium' | 'free' {
  const priceId = sub.items.data[0]?.price.id
  if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) return 'premium'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  return 'free'
}
```

---

## tierガードミドルウェア

```ts
// apps/api/src/middleware/tier.ts
import { createMiddleware } from 'hono/factory'
import { db } from '@atrox/db'
import { users } from '@atrox/db/schema'
import { eq } from 'drizzle-orm'

const tierOrder = { free: 0, pro: 1, premium: 2 } as const
type Tier = keyof typeof tierOrder

export const tierGuard = (required: Tier) =>
  createMiddleware(async (c, next) => {
    const userId = c.get('userId') // authミドルウェアで設定済み

    const [user] = await db
      .select({ tier: users.tier })
      .from(users)
      .where(eq(users.id, userId))

    if (!user) return c.json({ error: 'User not found' }, 404)

    const userTierLevel = tierOrder[user.tier as Tier] ?? 0
    const requiredLevel = tierOrder[required]

    if (userTierLevel < requiredLevel) {
      return c.json({ error: 'Upgrade required', required }, 403)
    }

    c.set('userTier', user.tier)
    await next()
  })
```

---

## チェックアウトセッション作成

```ts
// apps/api/src/routes/billing.ts
export const createCheckoutSession = async (c: Context) => {
  const userId = c.get('userId')
  const { tier } = await c.req.json<{ tier: 'pro' | 'premium' }>()

  const priceId = tier === 'premium'
    ? process.env.STRIPE_PREMIUM_PRICE_ID!
    : process.env.STRIPE_PRO_PRICE_ID!

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    metadata: { userId },
  })

  return c.json({ url: session.url })
}
```

---

## commentのweight設定

```ts
// apps/api/src/routes/comments.ts
// コメント投稿時にtierに応じたweightを自動設定する
const weightByTier = { free: 1, pro: 2, premium: 3 }

export const createComment = async (c: Context) => {
  const userTier = c.get('userTier') as 'free' | 'pro' | 'premium'
  const { episodeId, body } = await c.req.json()

  await db.insert(comments).values({
    episodeId,
    userId: c.get('userId'),
    body,
    weight: weightByTier[userTier],
  })

  return c.json({ success: true }, 201)
}
```

---

## 注意事項

- Webhookは署名検証を**必ず**行う。検証なしで処理するのは禁止
- `stripe.webhooks.constructEvent`の第1引数は生のテキスト（`c.req.text()`）。JSONパース後では署名が合わない
- フロントエンドからStripe APIを直接呼ばない。必ずAPIルート経由
- チャージバック対策として返金不可ポリシーをToSに明記済み