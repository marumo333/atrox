import { describe, it, expect } from 'vitest'
import { authConfig } from '../lib/auth-config'

describe('authConfig (edge-safe)', () => {
  it('uses jwt session strategy', () => {
    expect(authConfig.session?.strategy).toBe('jwt')
  })

  it('has sign-in page configured to /login', () => {
    expect(authConfig.pages?.signIn).toBe('/login')
  })

  it('has authorized callback', () => {
    expect(authConfig.callbacks?.authorized).toBeTypeOf('function')
  })

  it('has empty providers (populated in auth.ts)', () => {
    expect(authConfig.providers).toHaveLength(0)
  })
})
