import { describe, it, expect } from 'vitest'
import { sortCommentsByWeight } from '../comment-aggregator'

describe('sortCommentsByWeight', () => {
  it('sorts comments by weight descending, then by date descending', () => {
    const comments = [
      { body: 'free comment', weight: 1, createdAt: new Date('2026-01-01') },
      { body: 'pro comment', weight: 2, createdAt: new Date('2026-01-02') },
      { body: 'premium comment', weight: 3, createdAt: new Date('2026-01-01') },
      { body: 'another pro', weight: 2, createdAt: new Date('2026-01-03') },
    ]

    const sorted = sortCommentsByWeight(comments)
    expect(sorted[0]!.body).toBe('premium comment')
    expect(sorted[1]!.body).toBe('another pro')
    expect(sorted[2]!.body).toBe('pro comment')
    expect(sorted[3]!.body).toBe('free comment')
  })

  it('returns top N comments when limit is specified', () => {
    const comments = [
      { body: 'a', weight: 3, createdAt: new Date() },
      { body: 'b', weight: 2, createdAt: new Date() },
      { body: 'c', weight: 1, createdAt: new Date() },
    ]

    const result = sortCommentsByWeight(comments, 2)
    expect(result).toHaveLength(2)
  })
})
