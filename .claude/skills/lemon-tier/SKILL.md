---
name: lemon-tier
description: Lemon SqueezyサブスクリプションとFree/Pro/Premiumのtier管理を実装するときに使う。Webhookの処理、tier判定ミドルウェア、checkout生成が含まれる作業では必ずこのスキルを参照すること。
---

# Lemon Squeezy Tier管理 実装ガイド

Atroxは **Merchant of Record** として Lemon Squeezy を採用。Stripeを使わない理由：
- 海外VAT/税務を完全代行（EU VAT MOSS、英国VAT、米国State Tax、豪GST等）
- 個人開発者の本名・住所が顧客に公開されない
- チャージバック対応もLemon Squeezy側が処理

---

## Lemon Squeezy製品設定（ダッシュボードで手動設定）

```
Store: Atrox
  Product: Atrox Pro
    Variant: $8/mo recurring
    Variant ID → .envの LEMONSQUEEZY_VARIANT_PRO

  Product: Atrox Premium
    Variant: $24/mo recurring
    Variant ID → .envの LEMONSQUEEZY_VARIANT_PREMIUM
```

---

## 必要な環境変数

```bash
LEMONSQUEEZY_API_KEY=ls_...
LEMONSQUEEZY_WEBHOOK_SECRET=your-signing-secret
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_VARIANT_PRO=67890
LEMONSQUEEZY_VARIANT_PREMIUM=67891
```

---

## Webhook署名検証

**必ずHMAC SHA256で検証すること。** ヘッダは `X-Signature`。

```ts
import crypto from 'node:crypto'

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
  const hmac = crypto.createHmac('sha256', secret)
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8')
  const sig = Buffer.from(signature, 'utf8')
  if (digest.length !== sig.length) return false
  return crypto.timingSafeEqual(digest, sig)
}
```

`c.req.text()` で生ボディを取得すること。JSONパース後では署名が合わない。

---

## Webhookイベント処理

対応するイベント：

- `subscription_created` — 新規登録
- `subscription_updated` — プラン変更・再開
- `subscription_cancelled` — 解約（`ends_at` まで有効）
- `subscription_expired` — 終了（即時無効）
- `subscription_resumed` — 解約取消

```ts
switch (event) {
  case 'subscription_created':
  case 'subscription_updated':
  case 'subscription_resumed': {
    const tier = isEntitled(attrs.status, attrs.ends_at)
      ? variantToTier(attrs.variant_id)
      : 'free'
    // DB更新
    break
  }
  case 'subscription_expired':
  case 'subscription_cancelled': {
    const tier = isEntitled(attrs.status, attrs.ends_at)
      ? variantToTier(attrs.variant_id)
      : 'free'
    break
  }
}
```

---

## Entitlement判定ロジック

```ts
// apps/api/src/lib/tier-mapping.ts
export function isEntitled(status: string, endsAt: string | null): boolean {
  if (status === 'on_trial' || status === 'active' || status === 'past_due') {
    return true
  }
  // 解約済みでも期限内はアクセス可
  if (status === 'cancelled' && endsAt && new Date(endsAt) > new Date()) {
    return true
  }
  return false
}
```

---

## Variant ID → Tier 変換

```ts
export function variantToTier(variantId: number | string): Tier {
  const id = String(variantId)
  if (id === process.env.LEMONSQUEEZY_VARIANT_PREMIUM) return 'premium'
  if (id === process.env.LEMONSQUEEZY_VARIANT_PRO) return 'pro'
  return 'free'
}
```

---

## Checkout セッション作成

```ts
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js'

lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! })

const { data, error } = await createCheckout(
  process.env.LEMONSQUEEZY_STORE_ID!,
  variantId,
  {
    checkoutData: {
      custom: { user_id: userId }, // webhookの meta.custom_data で受け取る
    },
    productOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_URL}/episodes?upgraded=true`,
      receiptButtonText: 'Return to Atrox',
    },
  }
)

return c.json({ url: data?.data.attributes.url })
```

`redirectUrl` の末尾に `?upgraded=true` を必ず付与する。この flag を `UpgradeHandler` クライアントコンポーネントが検知して session を自動更新する。

---

## Session自動更新フロー（決済後のUX）

Lemon Squeezy の webhook が非同期で届くため、決済直後の redirect 時点では JWT の tier がまだ 'free' のままの可能性がある。このまま `/episodes` に飛ばすと Pro コンテンツが読めない。

### 解決: pollTierUpdate + JWT refresh

**1. UpgradeHandler (client component)**
`/episodes` にマウント。`?upgraded=true` を検知したら `pollTierUpdate` を起動。

```tsx
// apps/web/src/components/upgrade-handler.tsx
'use client'
import { useSession } from 'next-auth/react'
import { pollTierUpdate } from '@/lib/poll-tier-update'

export function UpgradeHandler() {
  const params = useSearchParams()
  const { data: session, update } = useSession()

  useEffect(() => {
    if (params.get('upgraded') !== 'true') return
    void pollTierUpdate({
      update: () => update(),
      getCurrentTier: () => session?.user?.tier,
      sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
      maxAttempts: 4,
      intervalMs: 1500,
    }).finally(() => router.replace('/episodes'))
  }, [...])
  return null
}
```

**2. pollTierUpdate (pure logic)**
最大 4 回 × 1.5秒 = 6 秒ウインドウで session.update() をリトライ。

**3. jwt callback (server)**
NextAuth v5 の `trigger === 'update'` を検知して DB から最新 tier を再読込。

```ts
// apps/web/src/lib/auth.ts
callbacks: {
  async jwt({ token, user, trigger }) {
    if (user) {
      token.userId = user.id ?? ''
      token.tier = user.tier
    }
    if (trigger === 'update' && token.userId) {
      const { findUserById } = await import('./user-service')
      const { refreshTokenTier } = await import('./refresh-token-tier')
      await refreshTokenTier(token, findUserById)
    }
    return token
  }
}
```

動的 import を使うのは Edge middleware から DB コードを分離するため。

**4. refreshTokenTier (pure logic)**
fetchUser callback を受け取ってテスト可能:

```ts
export async function refreshTokenTier<T extends MutableTokenWithTier>(
  token: T,
  fetchUser: (id: string) => Promise<FreshUser | null>,
): Promise<T> {
  if (!token.userId) return token
  const fresh = await fetchUser(token.userId)
  if (fresh) token.tier = fresh.tier
  return token
}
```

---

## tierガードミドルウェア

```ts
import { createMiddleware } from 'hono/factory'
import { db } from '@atrox/db'
import { users } from '@atrox/db/schema'
import { eq } from 'drizzle-orm'

export const tierGuard = (required: Tier) =>
  createMiddleware(async (c, next) => {
    const userId = c.get('userId')
    const [user] = await db
      .select({ tier: users.tier })
      .from(users)
      .where(eq(users.id, userId))

    if (!user) return c.json({ error: 'User not found' }, 404)

    if (TIER_ORDER[user.tier] < TIER_ORDER[required]) {
      return c.json({ error: 'Upgrade required', required }, 403)
    }
    c.set('userTier', user.tier)
    await next()
  })
```

---

## 注意事項

- Webhookは署名検証を**必ず**行う。検証なしで処理するのは禁止
- `c.req.text()` で生ボディを取得してから検証・パースする
- フロントエンドからLemon Squeezy APIを直接呼ばない。必ずAPIルート経由
- チャージバック対策としてLemon Squeezy側に委ねる（返金不可ポリシーをToSに明記済み）
- Subscription `status` の終端値は `expired`。`cancelled` は `ends_at` まで有効
