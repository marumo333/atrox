'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawCallback = searchParams.get('callbackUrl') ?? '/episodes'
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
    <div className="mx-auto max-w-sm px-6 py-28 animate-fade-up">
      <h1 className="font-display text-2xl text-center mb-10 tracking-tight">
        {isRegistering ? 'Create Account' : 'Sign In'}
      </h1>

      {error && (
        <p className="mb-6 border border-accent/30 bg-accent/5 p-3 text-sm text-accent">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          minLength={8}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent py-3 text-xs uppercase tracking-widest text-fg hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {loading ? '...' : isRegistering ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setIsRegistering(!isRegistering)
          setError('')
        }}
        className="mt-6 block w-full text-center text-xs text-fg-muted tracking-wider hover:text-fg transition-colors"
      >
        {isRegistering
          ? 'Already have an account? Sign in'
          : "Don't have an account? Create one"}
      </button>
    </div>
  )
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  minLength,
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  minLength?: number
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs tracking-widest text-fg-muted uppercase mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={minLength}
        className="w-full border border-border bg-bg-elevated px-4 py-3 text-fg placeholder:text-fg-muted/40 focus:border-gold/40 focus:outline-none transition-colors"
      />
    </div>
  )
}
