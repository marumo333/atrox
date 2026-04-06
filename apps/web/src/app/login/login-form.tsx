'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawCallback = searchParams.get('callbackUrl') ?? '/episodes'
  // Prevent open redirect — only allow relative paths
  const callbackUrl = rawCallback.startsWith('/') ? rawCallback : '/episodes'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegistering) {
        await handleRegister()
      } else {
        await handleSignIn()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignIn() {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password.')
      return
    }

    router.push(callbackUrl)
  }

  async function handleRegister() {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = (await res.json()) as { error: string }
      setError(data.error)
      return
    }

    await handleSignIn()
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="mb-8 text-center text-2xl font-bold">
        {isRegistering ? 'Create Account' : 'Sign In'}
      </h1>

      {error && (
        <p className="mb-4 rounded bg-accent/20 p-3 text-sm text-accent-light">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-muted bg-background px-3 py-2 text-foreground focus:border-accent-light focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded border border-muted bg-background px-3 py-2 text-foreground focus:border-accent-light focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-accent py-2 font-medium hover:bg-accent-light disabled:opacity-50"
        >
          {loading
            ? 'Loading...'
            : isRegistering
              ? 'Create Account'
              : 'Sign In'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setIsRegistering(!isRegistering)
          setError('')
        }}
        className="mt-4 block w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {isRegistering
          ? 'Already have an account? Sign in'
          : "Don't have an account? Create one"}
      </button>
    </div>
  )
}
