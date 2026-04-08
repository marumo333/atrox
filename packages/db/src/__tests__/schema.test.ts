import { describe, it, expect } from 'vitest'
import * as schema from '../schema/index'

describe('schema exports', () => {
  it('exports all required tables', () => {
    expect(schema.characters).toBeDefined()
    expect(schema.arcs).toBeDefined()
    expect(schema.arcState).toBeDefined()
    expect(schema.episodes).toBeDefined()
    expect(schema.users).toBeDefined()
    expect(schema.comments).toBeDefined()
    expect(schema.agentQueue).toBeDefined()
    expect(schema.premiumCharacters).toBeDefined()
  })
})
