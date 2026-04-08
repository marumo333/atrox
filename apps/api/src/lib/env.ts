export interface ApiEnv {
  AUTH_SECRET: string
  LEMONSQUEEZY_API_KEY: string
  LEMONSQUEEZY_WEBHOOK_SECRET: string
  LEMONSQUEEZY_STORE_ID: string
  LEMONSQUEEZY_VARIANT_PRO: string
  LEMONSQUEEZY_VARIANT_PREMIUM: string
  CRON_SECRET: string
  NEXT_PUBLIC_URL: string
}

const REQUIRED_VARS = [
  'AUTH_SECRET',
  'LEMONSQUEEZY_API_KEY',
  'LEMONSQUEEZY_WEBHOOK_SECRET',
  'LEMONSQUEEZY_STORE_ID',
  'LEMONSQUEEZY_VARIANT_PRO',
  'LEMONSQUEEZY_VARIANT_PREMIUM',
  'CRON_SECRET',
  'NEXT_PUBLIC_URL',
] as const satisfies readonly (keyof ApiEnv)[]

let _env: ApiEnv | null = null

/**
 * Type-safe accessor for ALL required environment variables.
 * Validates every var at first call and caches the result.
 * Use this in production code. For tests that only need one
 * variable, use requireEnv() instead.
 */
export function getEnv(): ApiEnv {
  if (_env) return _env

  const missing = REQUIRED_VARS.filter((k) => !process.env[k])
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`)
  }

  const result = {} as ApiEnv
  for (const key of REQUIRED_VARS) {
    result[key] = process.env[key]!
  }

  _env = result
  return _env
}

/**
 * Read a single env var with a presence check. Does not cache.
 * Prefer this in middleware that only needs one variable so tests
 * can mutate process.env without setting every other required var.
 */
export function requireEnv(key: keyof ApiEnv): string {
  const value = process.env[key]
  if (!value) throw new Error(`${key} is not set`)
  return value
}
