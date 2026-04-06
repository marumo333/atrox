export interface ApiEnv {
  AUTH_SECRET: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  STRIPE_PRO_PRICE_ID: string
  STRIPE_PREMIUM_PRICE_ID: string
  CRON_SECRET: string
  NEXT_PUBLIC_URL: string
}

const REQUIRED_VARS = [
  'AUTH_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRO_PRICE_ID',
  'STRIPE_PREMIUM_PRICE_ID',
  'CRON_SECRET',
  'NEXT_PUBLIC_URL',
] as const

let _env: ApiEnv | null = null

export function getEnv(): ApiEnv {
  if (_env) return _env

  const missing = REQUIRED_VARS.filter((k) => !process.env[k])
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`)
  }

  _env = Object.fromEntries(
    REQUIRED_VARS.map((k) => [k, process.env[k]!]),
  ) as unknown as ApiEnv

  return _env
}
