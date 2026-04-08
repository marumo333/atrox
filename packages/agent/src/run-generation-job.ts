import {
  getPendingJob,
  updateJobStatus,
  getArcStateByArcId,
  getTopComments,
  getAllEpisodesForArc,
  getRecentEpisodeIds,
  schema,
} from '@atrox/db'
import type { DbClient } from '@atrox/db'
import type { ArcStateData, WorldState, RecurringEntities } from '@atrox/types'
import { eq } from 'drizzle-orm'
import { buildPrompt } from './prompt-builder'
import { generateEpisodeText } from './generator'
import { nextMonday } from './next-monday'
import { parseEpisode } from './episode-parser'
import {
  mergeWorldState,
  extractEntities,
  appendStyleNote,
  appendEmotionalNote,
} from './state-updater'

interface CharacterInfo {
  personaPrompt: string
  styleRules: string
}

type GetCharacter = (arcId: string) => Promise<CharacterInfo>

/**
 * Claims one pending agent_queue job atomically, generates the next
 * episode via Claude, and saves it. On success, enqueues the next
 * week's pending job. On failure, marks the job as failed with the
 * error message — no auto-retry.
 */
export async function runGenerationJob(
  db: DbClient,
  getCharacter: GetCharacter,
): Promise<{ generated: boolean }> {
  const job = await getPendingJob(db)
  if (!job) return { generated: false }

  const jobId = job.id
  const arcId = job.arcId

  try {
    const rawBody = await generateEpisode(db, arcId, getCharacter)
    await finalizeJobSuccess(db, jobId, arcId, rawBody)
    return { generated: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await updateJobStatus(db, jobId, 'failed', message)
    throw err
  }
}

async function generateEpisode(
  db: DbClient,
  arcId: string,
  getCharacter: GetCharacter,
): Promise<string> {
  const stateData = await loadArcState(db, arcId)
  const character = await getCharacter(arcId)
  const episodeNumber = stateData.episodeCount + 1

  const prompt = await buildEpisodePrompt(
    db,
    arcId,
    character,
    stateData,
    episodeNumber,
  )
  const rawBody = await generateEpisodeText(prompt)

  await saveEpisodeAndUpdateState(db, arcId, rawBody, episodeNumber, stateData)
  return rawBody
}

async function loadArcState(
  db: DbClient,
  arcId: string,
): Promise<ArcStateData> {
  const state = await getArcStateByArcId(db, arcId)
  if (!state) throw new Error(`No arc_state for arc ${arcId}`)
  return toArcStateData(state)
}

async function buildEpisodePrompt(
  db: DbClient,
  arcId: string,
  character: CharacterInfo,
  stateData: ArcStateData,
  episodeNumber: number,
): Promise<string> {
  const previousEpisodes = await getAllEpisodesForArc(db, arcId)
  const recentEpisodeIds = await getRecentEpisodeIds(db, arcId, 3)
  const recentComments = await getTopComments(db, recentEpisodeIds, 5)

  return buildPrompt({
    character,
    arcState: stateData,
    previousEpisodes,
    topComments: recentComments.map((c) => ({ body: c.body })),
    episodeNumber,
  })
}

async function finalizeJobSuccess(
  db: DbClient,
  jobId: string,
  arcId: string,
  _rawBody: string,
): Promise<void> {
  await db.batch([
    db
      .update(schema.agentQueue)
      .set({ status: 'done', completedAt: new Date() })
      .where(eq(schema.agentQueue.id, jobId)),
    db.insert(schema.agentQueue).values({
      arcId,
      trigger: 'cron_weekly',
      status: 'pending',
      scheduledAt: nextMonday(),
    }),
  ])
}

function toArcStateData(state: Record<string, unknown>): ArcStateData {
  return {
    worldState: state.worldState as WorldState,
    recurringEntities: state.recurringEntities as RecurringEntities,
    styleDrift: state.styleDrift as ArcStateData['styleDrift'],
    emotionalLog: state.emotionalLog as ArcStateData['emotionalLog'],
    episodeCount: state.episodeCount as number,
  }
}

async function saveEpisodeAndUpdateState(
  db: DbClient,
  arcId: string,
  rawBody: string,
  episodeNumber: number,
  current: ArcStateData,
): Promise<void> {
  const parsed = parseEpisode(rawBody)

  await db.batch([
    db.insert(schema.episodes).values({
      arcId,
      episodeNumber,
      title: parsed.title,
      body: parsed.body,
      tier: 'pro',
      publishedAt: new Date(),
    }),
    db
      .update(schema.arcState)
      .set({
        episodeCount: episodeNumber,
        worldState: mergeWorldState(current.worldState, parsed.body),
        recurringEntities: extractEntities(
          parsed.body,
          current.recurringEntities,
        ),
        styleDrift: appendStyleNote(current.styleDrift, parsed.body),
        emotionalLog: appendEmotionalNote(current.emotionalLog),
        updatedAt: new Date(),
      })
      .where(eq(schema.arcState.arcId, arcId)),
  ])
}
