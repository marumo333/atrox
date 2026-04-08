import { describe, it, expect, vi } from 'vitest'
import { pollTierUpdate } from '../lib/poll-tier-update'

describe('pollTierUpdate', () => {
  it('returns true on first attempt when tier already upgraded', async () => {
    const update = vi.fn().mockResolvedValue(undefined)
    const sleep = vi.fn().mockResolvedValue(undefined)
    const ok = await pollTierUpdate({
      update,
      getCurrentTier: () => 'pro',
      sleep,
      maxAttempts: 4,
      intervalMs: 100,
    })
    expect(ok).toBe(true)
    expect(update).toHaveBeenCalledTimes(1)
    expect(sleep).not.toHaveBeenCalled()
  })

  it('retries until the webhook lands and tier becomes pro', async () => {
    const update = vi.fn().mockResolvedValue(undefined)
    const sleep = vi.fn().mockResolvedValue(undefined)
    const tiers = ['free', 'free', 'pro']
    let i = 0
    const ok = await pollTierUpdate({
      update,
      getCurrentTier: () => tiers[i++] ?? 'pro',
      sleep,
      maxAttempts: 4,
      intervalMs: 100,
    })
    expect(ok).toBe(true)
    expect(update).toHaveBeenCalledTimes(3)
    expect(sleep).toHaveBeenCalledTimes(2)
  })

  it('returns false when tier never upgrades within maxAttempts', async () => {
    const update = vi.fn().mockResolvedValue(undefined)
    const sleep = vi.fn().mockResolvedValue(undefined)
    const ok = await pollTierUpdate({
      update,
      getCurrentTier: () => 'free',
      sleep,
      maxAttempts: 3,
      intervalMs: 100,
    })
    expect(ok).toBe(false)
    expect(update).toHaveBeenCalledTimes(3)
    // sleeps between attempts only (not after the last)
    expect(sleep).toHaveBeenCalledTimes(2)
  })

  it('treats undefined tier as not yet upgraded', async () => {
    const update = vi.fn().mockResolvedValue(undefined)
    const sleep = vi.fn().mockResolvedValue(undefined)
    const ok = await pollTierUpdate({
      update,
      getCurrentTier: () => undefined,
      sleep,
      maxAttempts: 2,
      intervalMs: 10,
    })
    expect(ok).toBe(false)
  })
})
