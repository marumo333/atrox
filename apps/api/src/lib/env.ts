export interface ApiEnv {
  AUTH_SECRET: string
  LEMONSQUEEZY_API_KEY: string
  LEMONSQUEEZY_WEBHOOK_SECRET: string
  LEMONSQUEEZY_STORE_ID: string
  LEMONSQUEEZY_VARIANT_PRO: string
  /** Optional — only set once Premium tier is launched. */
  LEMONSQUEEZY_VARIANT_PREMIUM?: string
  CRON_SECRET: string
  NEXT_PUBLIC_URL: string
}

const REQUIRED_VARS = [
  'AUTH_SECRET',
  'LEMONSQUEEZY_API_KEY',
  'LEMONSQUEEZY_WEBHOOK_SECRET',
  'LEMONSQUEEZY_STORE_ID',
  'LEMONSQUEEZY_VARIANT_PRO',
  'CRON_SECRET',
  'NEXT_PUBLIC_URL',
] as const satisfies readonly (keyof ApiEnv)[]

let _env: ApiEnv | null = null

/**
 * Type-safe accessor for required environment variables.
 * Validates all required vars at first call and caches the result.
 * Optional vars (e.g. LEMONSQUEEZY_VARIANT_PREMIUM) are read lazily
 * via process.env and may be undefined.
 */
export function getEnv(): ApiEnv {
  if (_env) return _env

  const missing = REQUIRED_VARS.filter((k) => !process.env[k])
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`)
  }

  const result: ApiEnv = {
    AUTH_SECRET: process.env.AUTH_SECRET!,
    LEMONSQUEEZY_API_KEY: process.env.LEMONSQUEEZY_API_KEY!,
    LEMONSQUEEZY_WEBHOOK_SECRET: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
    LEMONSQUEEZY_STORE_ID: process.env.LEMONSQUEEZY_STORE_ID!,
    LEMONSQUEEZY_VARIANT_PRO: process.env.LEMONSQUEEZY_VARIANT_PRO!,
    LEMONSQUEEZY_VARIANT_PREMIUM: process.env.LEMONSQUEEZY_VARIANT_PREMIUM,
    CRON_SECRET: process.env.CRON_SECRET!,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL!,
  }

  _env = result
  return _env
}

/**
 * Read a single required env var without caching. Used by middleware
 * that only needs one variable, so tests can mutate process.env
 * without providing the full set.
 */
export function requireEnv(key: 'AUTH_SECRET' | 'CRON_SECRET'): string {
  const value = process.env[key]
  if (!value) throw new Error(`${key} is not set`)
  return value
}
