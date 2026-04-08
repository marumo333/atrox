import { NextResponse } from 'next/server'
import {
  lemonSqueezySetup,
  createCheckout,
} from '@lemonsqueezy/lemonsqueezy.js'
import { auth } from '@/lib/auth'
import {
  getLemonApiKey,
  getLemonStoreId,
  getLemonVariantPro,
  getPublicUrl,
} from '@/lib/env-api'

export const runtime = 'nodejs'

let initialized = false
function ensureSetup() {
  if (initialized) return
  lemonSqueezySetup({ apiKey: getLemonApiKey() })
  initialized = true
}

export async function POST(req: Request) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as { tier?: string }
  if (body.tier !== 'pro') {
    // MVP: only Pro is purchasable. Premium is reserved for Phase 2.
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  ensureSetup()
  const storeId = getLemonStoreId()
  const variantId = getLemonVariantPro()

  const { data, error } = await createCheckout(storeId, variantId, {
    checkoutData: {
      custom: { user_id: userId },
    },
    productOptions: {
      redirectUrl: `${getPublicUrl()}/episodes?upgraded=true`,
      receiptButtonText: 'Return to Atrox',
    },
  })

  if (error || !data) {
    console.error('[billing/checkout] createCheckout failed:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 },
    )
  }

  return NextResponse.json({ url: data.data.attributes.url })
}
