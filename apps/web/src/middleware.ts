import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth-config'

// Edge-safe middleware — uses only authConfig (no DB/Node.js imports)
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
