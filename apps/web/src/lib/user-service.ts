import { db } from '@atrox/db'
import { users } from '@atrox/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from './password'

interface UserRecord {
  id: string
  email: string
  passwordHash: string
  tier: string
}

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  return user ?? null
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)

  return user ?? null
}

export async function createUser(
  email: string,
  password: string,
): Promise<UserRecord> {
  const passwordHash = await hashPassword(password)

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning()

  if (!user) throw new Error('Failed to create user')

  return user
}
