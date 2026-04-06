import type { PromptInput } from '@atrox/types'
import { sanitizeComments } from './prompt-sanitizer'

const SECTION_SEPARATOR = '\n\n---\n\n'

export function buildPrompt(input: PromptInput): string {
  const safeComments = sanitizeComments(input.topComments)
  return [
    input.character.personaPrompt,
    input.character.styleRules,
    buildWorldStateSection(input),
    buildEntitiesSection(input),
    buildStyleDriftSection(input),
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

function buildReaderInputSection(comments: { body: string }[]): string {
  const bodies = comments.map((c) => c.body).join('\n')
  return `## Reader Input This Week\n${bodies}`
}

function buildGenerationInstruction(episodeNumber: number): string {
  return `Write episode ${episodeNumber} of the current arc. Do not summarize. Just write.`
}
