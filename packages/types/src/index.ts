// ── Tier ──
export type Tier = 'free' | 'pro' | 'premium'

export const TIER_ORDER: Record<Tier, number> = {
  free: 0,
  pro: 1,
  premium: 2,
} as const

export const WEIGHT_BY_TIER: Record<Tier, number> = {
  free: 1,
  pro: 2,
  premium: 3,
} as const

// ── Arc ──
export type ArcStatus = 'draft' | 'active' | 'completed'

// ── Arc State (jsonb columns) ──
export interface WorldState {
  summary: string
  currentConflicts: string[]
  recentEvents: string[]
}

export interface RecurringEntity {
  name: string
  role: string
  description: string
  lastSeenEpisode: number
}

export type RecurringEntities = Record<string, RecurringEntity>

export interface StyleDriftEntry {
  episodeNumber: number
  note: string
}

export interface EmotionalLogEntry {
  episodeNumber: number
  dominantEmotion: string
  tensionLevel: number // 1-10
}

export interface ArcStateData {
  worldState: WorldState
  recurringEntities: RecurringEntities
  styleDrift: StyleDriftEntry[]
  emotionalLog: EmotionalLogEntry[]
  episodeCount: number
}

// ── Agent Queue ──
export type QueueTrigger = 'cron_weekly' | 'manual'
export type QueueStatus = 'pending' | 'running' | 'done' | 'failed'

export interface InputSnapshot {
  arcId: string
  episodeNumber: number
  topCommentIds: string[]
}

// ── Prompt Builder ──
export interface PromptInput {
  character: {
    personaPrompt: string
    styleRules: string
  }
  arcState: ArcStateData
  topComments: { body: string }[]
  episodeNumber: number
}
