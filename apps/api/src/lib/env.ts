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
