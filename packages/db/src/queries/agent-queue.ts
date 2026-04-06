import { eq } from 'drizzle-orm'
import type { DbClient } from '../client'
import { agentQueue } from '../schema/index'
import type { QueueStatus } from '@atrox/types'

export async function getPendingJob(db: DbClient) {
  const [job] = await db
    .select()
    .from(agentQueue)
    .where(eq(agentQueue.status, 'pending'))
    .limit(1)

  return job ?? null
}

export async function updateJobStatus(
  db: DbClient,
  jobId: string,
  status: QueueStatus,
  errorLog?: string,
) {
  const now = new Date()
  await db
    .update(agentQueue)
    .set({
      status,
      ...(status === 'running' ? { startedAt: now } : {}),
      ...(status === 'done' || status === 'failed' ? { completedAt: now } : {}),
      ...(errorLog ? { errorLog } : {}),
    })
    .where(eq(agentQueue.id, jobId))
}

export async function enqueueNextJob(
  db: DbClient,
  arcId: string,
  scheduledAt: Date,
) {
  await db.insert(agentQueue).values({
    arcId,
    trigger: 'cron_weekly',
    status: 'pending',
    scheduledAt,
  })
}
