import NextAuth from 'next-auth'
import 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth-config'

// Type augmentations for NextAuth — extend session user and JWT with our fields
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      tier: string
    }
  }

  interface User {
    tier: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    tier: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        // Dynamic imports to avoid DB connection at module load time
        const { findUserByEmail } = await import('./user-service')
        const { verifyPassword } = await import('./password')

        const user = await findUserByEmail(email)
        if (!user) return null

        const valid = await verifyPassword(password, user.passwordHash)
        if (!valid) return null

        return { id: user.id, email: user.email, tier: user.tier }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user) {
        token.userId = user.id ?? ''
        token.tier = (user as { tier: string }).tier
      }
      // On explicit session.update() (e.g. after Lemon Squeezy checkout
      // redirect), re-read tier from DB so the JWT reflects the latest
      // subscription state without forcing the user to sign out.
      if (trigger === 'update' && token.userId) {
        const { findUserById } = await import('./user-service')
        const { refreshTokenTier } = await import('./refresh-token-tier')
        await refreshTokenTier(token, findUserById)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string
        ;(session.user as { tier: string }).tier = token.tier as string
      }
      return session
    },
  },
})
