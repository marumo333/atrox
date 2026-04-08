import type { DbClient } from '@atrox/db'
import {
  getPendingJob,
  updateJobStatus,
  enqueueNextJob,
  getArcStateByArcId,
  getTopComments,
} from '@atrox/db'
import { arcState, episodes, agentQueue } from '@atrox/db/schema'
import {
  buildPrompt,
  generateEpisodeText,
  nextMonday,
  mergeWorldState,
  extractEntities,
  appendStyleNote,
  appendEmotionalNote,
} from '@atrox/agent'
import type { ArcStateData, WorldState, RecurringEntities } from '@atrox/types'
import { eq } from 'drizzle-orm'

interface CharacterInfo {
  personaPrompt: string
  styleRules: string
}

type GetCharacter = (arcId: string) => Promise<CharacterInfo>

export async function runGenerationJob(
  db: DbClient,
  getCharacter: GetCharacter,
): Promise<{ generated: boolean }> {
  // getPendingJob atomically claims the job by marking it as 'running'
  const job = await getPendingJob(db)
  if (!job) return { generated: false }

  const jobId = job.id
  const arcId = job.arcId

  try {
    const episodeBody = await generateEpisode(db, arcId, getCharacter)
    await finalizeJobSuccess(db, jobId, arcId, episodeBody)
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
    character,
    stateData,
    episodeNumber,
  )
  const episodeBody = await generateEpisodeText(prompt)

  await saveEpisodeAndUpdateState(
    db,
    arcId,
    episodeBody,
    episodeNumber,
    stateData,
  )

  return episodeBody
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
  character: CharacterInfo,
  stateData: ArcStateData,
  episodeNumber: number,
): Promise<string> {
  const recentComments = await getTopComments(db, [], 5)
  return buildPrompt({
    character,
    arcState: stateData,
    topComments: recentComments.map((c) => ({ body: c.body })),
    episodeNumber,
  })
}

async function finalizeJobSuccess(
  db: DbClient,
  jobId: string,
  arcId: string,
  _episodeBody: string,
): Promise<void> {
  // Neon HTTP has no transactions — use db.batch for atomic multi-statement
  await db.batch([
    db
      .update(agentQueue)
      .set({ status: 'done', completedAt: new Date() })
      .where(eq(agentQueue.id, jobId)),
    db.insert(agentQueue).values({
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
  body: string,
  episodeNumber: number,
  current: ArcStateData,
): Promise<void> {
  // Neon HTTP has no transactions — use db.batch for atomic multi-statement
  await db.batch([
    db.insert(episodes).values({
      arcId,
      episodeNumber,
      body,
      tier: 'pro',
      publishedAt: new Date(),
    }),
    db
      .update(arcState)
      .set({
        episodeCount: episodeNumber,
        worldState: mergeWorldState(current.worldState, body),
        recurringEntities: extractEntities(body, current.recurringEntities),
        styleDrift: appendStyleNote(current.styleDrift, body),
        emotionalLog: appendEmotionalNote(current.emotionalLog),
        updatedAt: new Date(),
      })
      .where(eq(arcState.arcId, arcId)),
  ])
}
