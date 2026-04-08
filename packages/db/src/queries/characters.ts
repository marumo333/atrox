import { eq } from 'drizzle-orm'
import type { DbClient } from '../client'
import { characters } from '../schema/index'

export async function getCharacterBySlug(db: DbClient, slug: string) {
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.slug, slug))
    .limit(1)

  return character ?? null
}

export async function getAllCharacters(db: DbClient) {
  return db.select().from(characters).orderBy(characters.createdAt)
}
