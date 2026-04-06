import type { DbClient } from '@atrox/db'
import {
  getPendingJob,
  updateJobStatus,
  enqueueNextJob,
  getArcStateByArcId,
} from '@atrox/db'
import { arcState, episodes } from '@atrox/db/schema'
import {
  buildPrompt,
  generateEpisodeText,
  nextMonday,
  mergeWorldState,
  extractEntities,
  appendStyleNote,
  appendEmotionalNote,
} from '@atrox/agent'
import { getTopComments } from '@atrox/db'
import type { ArcStateData, WorldState, RecurringEntities } from '@atrox/types'
import { eq } from 'drizzle-orm'

export async function runGenerationJob(
  db: DbClient,
  getCharacter: (arcId: string) => Promise<{
    personaPrompt: string
    styleRules: string
  }>,
): Promise<{ generated: boolean }> {
  const job = await getPendingJob(db)
  if (!job) return { generated: false }

  await updateJobStatus(db, job.id, 'running')

  try {
    const state = await getArcStateByArcId(db, job.arcId)
    if (!state) throw new Error(`No arc_state for arc ${job.arcId}`)

    const character = await getCharacter(job.arcId)
    const stateData = toArcStateData(state)
    const recentComments = await getTopComments(db, [], 5)

    const prompt = buildPrompt({
      character,
      arcState: stateData,
      topComments: recentComments.map((c) => ({ body: c.body })),
      episodeNumber: stateData.episodeCount + 1,
    })

    const episodeBody = await generateEpisodeText(prompt)
    const newEpNumber = stateData.episodeCount + 1

    await saveEpisodeAndUpdateState(
      db,
      job.arcId,
      episodeBody,
      newEpNumber,
      stateData,
    )

    await updateJobStatus(db, job.id, 'done')
    await enqueueNextJob(db, job.arcId, nextMonday())

    return { generated: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await updateJobStatus(db, job.id, 'failed', message)
    throw err
  }
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
  await db.transaction(async (tx) => {
    await tx.insert(episodes).values({
      arcId,
      episodeNumber,
      body,
      tier: 'pro',
      publishedAt: new Date(),
    })

    await tx
      .update(arcState)
      .set({
        episodeCount: episodeNumber,
        worldState: mergeWorldState(current.worldState, body),
        recurringEntities: extractEntities(body, current.recurringEntities),
        styleDrift: appendStyleNote(current.styleDrift, body, episodeNumber),
        emotionalLog: appendEmotionalNote(current.emotionalLog, episodeNumber),
        updatedAt: new Date(),
      })
      .where(eq(arcState.arcId, arcId))
  })
}
