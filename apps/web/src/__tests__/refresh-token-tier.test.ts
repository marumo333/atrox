import { describe, it, expect, vi } from 'vitest'
import { refreshTokenTier } from '../lib/refresh-token-tier'

describe('refreshTokenTier', () => {
  it('returns token unchanged when userId is missing', async () => {
    const token = { tier: 'free' }
    const fetchUser = vi.fn()
    const result = await refreshTokenTier(token, fetchUser)
    expect(result.tier).toBe('free')
    expect(fetchUser).not.toHaveBeenCalled()
  })

  it('updates token tier with fresh DB value', async () => {
    const token = { userId: 'u1', tier: 'free' }
    const fetchUser = vi.fn().mockResolvedValue({ tier: 'pro' })
    const result = await refreshTokenTier(token, fetchUser)
    expect(fetchUser).toHaveBeenCalledWith('u1')
    expect(result.tier).toBe('pro')
  })

  it('leaves token tier unchanged when user not found', async () => {
    const token = { userId: 'u1', tier: 'pro' }
    const fetchUser = vi.fn().mockResolvedValue(null)
    const result = await refreshTokenTier(token, fetchUser)
    expect(result.tier).toBe('pro')
  })

  it('downgrades token tier from pro to free when DB says free', async () => {
    const token = { userId: 'u1', tier: 'pro' }
    const fetchUser = vi.fn().mockResolvedValue({ tier: 'free' })
    const result = await refreshTokenTier(token, fetchUser)
    expect(result.tier).toBe('free')
  })
})
