import { describe, it, expect } from 'vitest'
import { buildPrompt } from '../prompt-builder'
import type { PromptInput } from '@atrox/types'

const mockInput: PromptInput = {
  character: {
    personaPrompt: 'You are Vesper Black.',
    styleRules: 'No exclamation marks.',
  },
  arcState: {
    worldState: {
      summary: 'A dark world.',
      currentConflicts: ['war'],
      recentEvents: ['battle'],
    },
    recurringEntities: {
      vesper: {
        name: 'Vesper',
        role: 'protagonist',
        description: 'Cold writer',
        lastSeenEpisode: 3,
      },
    },
    styleDrift: [{ episodeNumber: 1, note: 'darker tone' }],
    emotionalLog: [
      { episodeNumber: 1, dominantEmotion: 'dread', tensionLevel: 7 },
    ],
    episodeCount: 3,
  },
  previousEpisodes: [
    {
      episodeNumber: 1,
      title: 'The Invitation',
      body: 'The letter arrived at dusk.',
    },
    {
      episodeNumber: 2,
      title: null,
      body: 'She burned it anyway.',
    },
  ],
  topComments: [{ body: 'More tension please' }],
  episodeNumber: 4,
}

describe('buildPrompt', () => {
  it('includes persona_prompt first', () => {
    const prompt = buildPrompt(mockInput)
    const firstSection = prompt.split('---')[0]!
    expect(firstSection).toContain('You are Vesper Black.')
  })

  it('includes style rules second', () => {
    const prompt = buildPrompt(mockInput)
    const sections = prompt.split('---')
    expect(sections[1]).toContain('No exclamation marks.')
  })

  it('includes previous episodes before reader comments', () => {
    const prompt = buildPrompt(mockInput)
    expect(prompt).toContain('The letter arrived at dusk.')
    const prevIdx = prompt.indexOf('Previous Episodes')
    const commentsIdx = prompt.indexOf('Reader Input')
    expect(prevIdx).toBeGreaterThan(-1)
    expect(prevIdx).toBeLessThan(commentsIdx)
  })

  it('shows empty marker when no previous episodes', () => {
    const prompt = buildPrompt({ ...mockInput, previousEpisodes: [] })
    expect(prompt).toContain('(none — this is the first episode')
  })

  it('includes reader comments near the end', () => {
    const prompt = buildPrompt(mockInput)
    expect(prompt).toContain('More tension please')
    const commentsIdx = prompt.indexOf('Reader Input')
    const instructionIdx = prompt.indexOf('Write episode')
    expect(commentsIdx).toBeLessThan(instructionIdx)
  })

  it('includes episode number in generation instruction', () => {
    const prompt = buildPrompt(mockInput)
    expect(prompt).toContain('Write episode 4')
  })
})
