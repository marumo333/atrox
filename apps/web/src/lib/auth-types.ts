import 'next-auth'
import 'next-auth/jwt'

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
