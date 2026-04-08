import type { PromptInput, PreviousEpisode } from '@atrox/types'
import { sanitizeComments } from './prompt-sanitizer'

const SECTION_SEPARATOR = '\n\n---\n\n'

/**
 * Builds the Claude prompt for episode generation.
 *
 * Ordering (per agent-loop skill — do not change):
 * 1. persona_prompt (character DNA, highest weight)
 * 2. style_rules (voice constraints)
 * 3. arc_state.worldState (current story context)
 * 4. arc_state.recurringEntities (characters, places)
 * 5. arc_state.styleDrift (Vesper's style evolution log)
 * 6. previousEpisodes (verbatim previous episodes for continuity)
 * 7. top_comments (reader input, lowest weight)
 * 8. generation instruction
 */
export function buildPrompt(input: PromptInput): string {
  const safeComments = sanitizeComments(input.topComments)
  return [
    input.character.personaPrompt,
    input.character.styleRules,
    buildWorldStateSection(input),
    buildEntitiesSection(input),
    buildStyleDriftSection(input),
    buildPreviousEpisodesSection(input.previousEpisodes),
    buildReaderInputSection(safeComments),
    buildGenerationInstruction(input.episodeNumber),
  ].join(SECTION_SEPARATOR)
}

function buildWorldStateSection(input: PromptInput): string {
  return `## Current Arc State\n${JSON.stringify(input.arcState.worldState)}`
}

function buildEntitiesSection(input: PromptInput): string {
  return `## Recurring Entities\n${JSON.stringify(input.arcState.recurringEntities)}`
}

function buildStyleDriftSection(input: PromptInput): string {
  return `## Style Evolution\n${JSON.stringify(input.arcState.styleDrift)}`
}

function buildPreviousEpisodesSection(
  episodes: readonly PreviousEpisode[],
): string {
  if (episodes.length === 0) {
    return '## Previous Episodes\n(none — this is the first episode of the arc)'
  }
  const formatted = episodes
    .map((ep) => {
      const header = `### Episode ${ep.episodeNumber}${ep.title ? ` — ${ep.title}` : ''}`
      return `${header}\n${ep.body}`
    })
    .join('\n\n')
  return `## Previous Episodes\n${formatted}`
}

function buildReaderInputSection(comments: { body: string }[]): string {
  const bodies = comments.map((c) => c.body).join('\n')
  return `## Reader Input This Week\n${bodies}`
}

function buildGenerationInstruction(episodeNumber: number): string {
  return `Write episode ${episodeNumber} of the current arc. Continue directly from where the previous episode ended. Maintain the voice, characters, and unresolved threads. Do not summarize. Just write.`
}
