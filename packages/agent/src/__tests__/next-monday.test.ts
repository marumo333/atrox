import { describe, it, expect } from 'vitest'
import { nextMonday } from '../next-monday'

describe('nextMonday', () => {
  it('returns a Monday', () => {
    const result = nextMonday(new Date('2026-04-06')) // Monday
    expect(result.getUTCDay()).toBe(1) // 1 = Monday
  })

  it('returns next week Monday when called on Monday', () => {
    const monday = new Date('2026-04-06')
    const result = nextMonday(monday)
    expect(result.toISOString().slice(0, 10)).toBe('2026-04-13')
  })

  it('returns upcoming Monday when called on Wednesday', () => {
    const wed = new Date('2026-04-08')
    const result = nextMonday(wed)
    expect(result.toISOString().slice(0, 10)).toBe('2026-04-13')
  })

  it('sets time to 09:00 UTC', () => {
    const result = nextMonday(new Date('2026-04-06'))
    expect(result.getUTCHours()).toBe(9)
    expect(result.getUTCMinutes()).toBe(0)
  })
})
