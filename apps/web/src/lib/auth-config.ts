import type { NextAuthConfig } from 'next-auth'

// Edge-safe config — no DB imports, no Node.js-only modules.
// Used by middleware. The Credentials provider authorize function
// lives in auth.ts (Node.js only).
export const authConfig = {
  session: { strategy: 'jwt' as const },
  pages: {
    signIn: '/login',
  },
  providers: [], // populated in auth.ts
  callbacks: {
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl
      if (pathname.startsWith('/dashboard') && !session) return false
      return true
    },
  },
} satisfies NextAuthConfig
