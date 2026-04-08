/**
 * Polls the session by repeatedly calling `update()` (NextAuth refresh)
 * until the current tier becomes a paid one or maxAttempts is exhausted.
 *
 * Used after Lemon Squeezy redirect to handle the race between checkout
 * redirect and webhook landing.
 */
export interface PollTierUpdateOptions {
  update: () => Promise<unknown>
  getCurrentTier: () => string | undefined
  sleep: (ms: number) => Promise<void>
  maxAttempts?: number
  intervalMs?: number
}

export async function pollTierUpdate(
  opts: PollTierUpdateOptions,
): Promise<boolean> {
  const max = opts.maxAttempts ?? 4
  const interval = opts.intervalMs ?? 1500

  for (let i = 0; i < max; i++) {
    await opts.update()
    const tier = opts.getCurrentTier()
    if (tier && tier !== 'free') return true
    if (i < max - 1) await opts.sleep(interval)
  }
  return false
}
