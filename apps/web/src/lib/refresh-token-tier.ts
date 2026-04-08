/**
 * Refreshes a JWT token's tier field by re-reading the user from the DB.
 * Pure logic — accepts a fetcher so it can be unit-tested without DB.
 */
interface FreshUser {
  tier: string
}

interface MutableTokenWithTier {
  userId?: string
  tier?: string
}

export async function refreshTokenTier<T extends MutableTokenWithTier>(
  token: T,
  fetchUser: (id: string) => Promise<FreshUser | null>,
): Promise<T> {
  if (!token.userId) return token
  const fresh = await fetchUser(token.userId)
  if (fresh) token.tier = fresh.tier
  return token
}
