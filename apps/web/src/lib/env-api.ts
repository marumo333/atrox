/**
 * Runtime environment variable accessors for server-side API routes.
 * Each function reads process.env fresh (no caching) so tests can
 * mutate variables without providing the full set.
 */

function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`${key} is not set`)
  return value
}

export function getLemonApiKey(): string {
  return required('LEMONSQUEEZY_API_KEY')
}

export function getLemonWebhookSecret(): string {
  return required('LEMONSQUEEZY_WEBHOOK_SECRET')
}

export function getLemonStoreId(): string {
  return required('LEMONSQUEEZY_STORE_ID')
}

export function getLemonVariantPro(): string {
  return required('LEMONSQUEEZY_VARIANT_PRO')
}

/** Optional — unset until Premium tier launches */
export function getLemonVariantPremium(): string | undefined {
  return process.env.LEMONSQUEEZY_VARIANT_PREMIUM
}

export function getPublicUrl(): string {
  return process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
}
