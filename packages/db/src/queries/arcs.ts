import { eq, and, desc } from 'drizzle-orm'
import type { DbClient } from '../client'
import { arcs } from '../schema/index'

export async function getActiveArc(db: DbClient, characterId: string) {
  const [arc] = await db
    .select()
    .from(arcs)
    .where(and(eq(arcs.characterId, characterId), eq(arcs.status, 'active')))
    .orderBy(desc(arcs.arcNumber))
    .limit(1)

  return arc ?? null
}

export async function getArcsByCharacter(db: DbClient, characterId: string) {
  return db
    .select()
    .from(arcs)
    .where(eq(arcs.characterId, characterId))
    .orderBy(desc(arcs.arcNumber))
}
