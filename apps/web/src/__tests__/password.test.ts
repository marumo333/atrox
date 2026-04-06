import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../lib/password'

describe('password utilities', () => {
  it('hashes a password', async () => {
    const hash = await hashPassword('test-password')
    expect(hash).not.toBe('test-password')
    expect(hash.length).toBeGreaterThan(20)
  })

  it('verifies a correct password', async () => {
    const hash = await hashPassword('correct-password')
    const result = await verifyPassword('correct-password', hash)
    expect(result).toBe(true)
  })

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('correct-password')
    const result = await verifyPassword('wrong-password', hash)
    expect(result).toBe(false)
  })
})
