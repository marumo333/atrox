import type {
  WorldState,
  RecurringEntities,
  StyleDriftEntry,
  EmotionalLogEntry,
} from '@atrox/types'

export function mergeWorldState(
  current: WorldState,
  _episodeBody: string,
): WorldState {
  return {
    ...current,
    recentEvents: [
      ...current.recentEvents.slice(-4),
      `Episode generated at ${new Date().toISOString()}`,
    ],
  }
}

export function extractEntities(
  _episodeBody: string,
  current: RecurringEntities,
): RecurringEntities {
  return { ...current }
}

export function appendStyleNote(
  current: StyleDriftEntry[],
  _episodeBody: string,
): StyleDriftEntry[] {
  const episodeNumber = current.length + 1
  return [...current, { episodeNumber, note: 'auto-generated style note' }]
}

export function appendEmotionalNote(
  current: EmotionalLogEntry[],
): EmotionalLogEntry[] {
  const episodeNumber = current.length + 1
  return [
    ...current,
    {
      episodeNumber,
      dominantEmotion: 'tension',
      tensionLevel: 5,
    },
  ]
}
