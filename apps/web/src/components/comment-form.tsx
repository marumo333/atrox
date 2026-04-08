'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const MAX_LENGTH = 500

export function CommentForm({
  episodeId,
  isAuthenticated,
}: {
  episodeId: string
  isAuthenticated: boolean
}) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="border border-border bg-bg-elevated p-6 text-center">
        <p className="text-sm text-fg-muted">
          <Link
            href="/login"
            className="text-gold hover:text-gold-muted underline underline-offset-2"
          >
            Sign in
          </Link>{' '}
          to leave a comment. Pro comments carry extra weight in shaping the
          next episode.
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (body.trim().length === 0) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId, body: body.trim() }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error: string }
        setError(data.error)
        return
      }

      setBody('')
      router.refresh()
    } catch {
      setError('Failed to post comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const remaining = MAX_LENGTH - body.length

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <p className="border border-accent/30 bg-accent/5 p-3 text-sm text-accent">
          {error}
        </p>
      )}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={MAX_LENGTH}
        placeholder="Tell Vesper what you think..."
        className="w-full min-h-[100px] border border-border bg-bg-elevated px-4 py-3 text-fg placeholder:text-fg-muted/40 focus:border-gold/40 focus:outline-none transition-colors resize-y"
      />
      <div className="flex items-center justify-between">
        <span
          className={`text-xs ${remaining < 50 ? 'text-accent' : 'text-fg-muted'}`}
        >
          {remaining} characters remaining
        </span>
        <button
          type="submit"
          disabled={submitting || body.trim().length === 0}
          className="border border-gold/40 px-6 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  )
}
