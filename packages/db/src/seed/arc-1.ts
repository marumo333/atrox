import type {
  WorldState,
  RecurringEntities,
  StyleDriftEntry,
  EmotionalLogEntry,
} from '@atrox/types'

export const ARC_1_PREMISE = `In the Court of Thorns, where the old blood still rules through contract and sacrifice, Lady Isolde Varré arrives with nothing but a letter sealed in dried blood and a name she was told never to speak. Kael Draeven, the Shadow Regent, should have forgotten that name a hundred years ago. He hasn't. Neither has the debt it carries.`

export const ARC_1_WORLD_STATE: WorldState = {
  summary:
    'The kingdom of Velaris is ruled by ancient bloodline contracts. The Court of Thorns is the seat of the Shadow Regent, who collects debts older than the crown itself.',
  currentConflicts: [
    'Isolde bears a debt she did not inherit willingly',
    'The Shadow Regent has been waiting for this name to return',
  ],
  recentEvents: ['Isolde arrives at the Court of Thorns at dusk'],
}

export const ARC_1_ENTITIES: RecurringEntities = {
  isolde_varre: {
    name: 'Lady Isolde Varré',
    role: 'Female Main Character',
    description:
      'Twenty-three. Daughter of the disgraced Varré line. Bearer of the Ashbourne letter.',
    lastSeenEpisode: 0,
  },
  kael_draeven: {
    name: 'Kael Draeven',
    role: 'Male Main Character',
    description:
      'The Shadow Regent. Ageless. Keeper of blood debts. Speaks only when it costs the listener.',
    lastSeenEpisode: 0,
  },
  court_of_thorns: {
    name: 'Court of Thorns',
    role: 'Primary Location',
    description:
      'A fortress of black stone wrapped in ironwood thorns. No mortal enters without the Regent\u2019s leave.',
    lastSeenEpisode: 0,
  },
}

export const ARC_1_STYLE_DRIFT: StyleDriftEntry[] = []
export const ARC_1_EMOTIONAL_LOG: EmotionalLogEntry[] = []
