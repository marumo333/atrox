import { NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/user-service'

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string
    password?: string
  }

  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 },
    )
  }

  if (body.password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 },
    )
  }

  const existing = await findUserByEmail(body.email)
  if (existing) {
    return NextResponse.json(
      { error: 'Email already registered' },
      { status: 409 },
    )
  }

  const user = await createUser(body.email, body.password)

  return NextResponse.json(
    { id: user.id, email: user.email },
    { status: 201 },
  )
}
