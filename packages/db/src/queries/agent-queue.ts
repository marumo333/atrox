import { eq, and, sql } from 'drizzle-orm'
import type { DbClient } from '../client'
import { agentQueue } from '../schema/index'
import type { QueueStatus } from '@atrox/types'

/**
 * Atomically claims a pending job by updating one pending row to 'running'
 * and returning it. Uses UPDATE ... WHERE id = (SELECT ... LIMIT 1) pattern
 * which is atomic even without session-level locking — suitable for Neon
 * HTTP driver. The updateJobStatus('running') call in runGenerationJob
 * becomes a no-op after this.
 */
export async function getPendingJob(db: DbClient) {
  const [job] = await db
    .update(agentQueue)
    .set({ status: 'running', startedAt: new Date() })
    .where(
      and(
        eq(agentQueue.status, 'pending'),
        sql`id = (SELECT id FROM agent_queue WHERE status = 'pending' ORDER BY scheduled_at ASC LIMIT 1)`,
      ),
    )
    .returning()

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
