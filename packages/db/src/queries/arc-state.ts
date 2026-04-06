import { eq } from 'drizzle-orm'
import type { DbClient } from '../client'
import { arcState } from '../schema/index'

export async function getArcStateByArcId(db: DbClient, arcId: string) {
  const [state] = await db
    .select()
    .from(arcState)
    .where(eq(arcState.arcId, arcId))
    .limit(1)

  return state ?? null
}
