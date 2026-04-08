import { describe, it, expect } from 'vitest'
import { parseEpisode } from '../episode-parser'

describe('parseEpisode', () => {
  it('extracts italic title from standard Claude output', () => {
    const raw = `# Court of Thorns
### Episode Two: *What the Debt Holds*

---

She did not sleep.

The room they gave her was cold.`

    const result = parseEpisode(raw)
    expect(result.title).toBe('What the Debt Holds')
    expect(result.body).toBe(
      'She did not sleep.\n\nThe room they gave her was cold.',
    )
  })

  it('extracts plain title without asterisks', () => {
    const raw = `# Court of Thorns
### Episode One: The Invitation

---

The letter arrived at dusk.`

    const result = parseEpisode(raw)
    expect(result.title).toBe('The Invitation')
    expect(result.body).toBe('The letter arrived at dusk.')
  })

  it('returns null title when no match', () => {
    const raw = `She did not sleep.

The room was cold.`

    const result = parseEpisode(raw)
    expect(result.title).toBe(null)
    expect(result.body).toBe('She did not sleep.\n\nThe room was cold.')
  })

  it('preserves internal horizontal rules in body', () => {
    const raw = `### Episode One: *Start*

---

Scene one.

---

Scene two.`

    const result = parseEpisode(raw)
    expect(result.title).toBe('Start')
    expect(result.body).toContain('Scene one.')
    expect(result.body).toContain('Scene two.')
    expect(result.body).toContain('---')
  })
})
