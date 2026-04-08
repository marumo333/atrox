import type { Metadata } from 'next'
import Link from 'next/link'
import {
  db,
  getCharacterBySlug,
  getActiveArc,
  getPublishedEpisodes,
  getEffectiveTier,
} from '@atrox/db'
import { getCurrentTier } from '@/lib/current-tier'
import { TIER_ORDER } from '@atrox/types'
import type { Tier } from '@atrox/types'

export const metadata: Metadata = {
  title: 'Episodes — Atrox',
  description:
    'Read all serialized episodes by Vesper Black. New episode every Monday.',
}

// Server Component reads DB via @atrox/db, must not prerender at build time
export const dynamic = 'force-dynamic'

export default async function EpisodesPage() {
  const character = await getCharacterBySlug(db, 'vesper-black')
  if (!character) {
    return <EmptyState message="Character not found." />
  }

  const arc = await getActiveArc(db, character.id)
  if (!arc) {
    return <EmptyState message="No active arc. Check back soon." />
  }

  const userTier = await getCurrentTier()
  const allEpisodes = await getPublishedEpisodes(db, arc.id)
  const userLevel = TIER_ORDER[userTier]

  // Filter by effective tier (respects 3-day early access window)
  const visible = allEpisodes.filter((ep) => {
    const effective = getEffectiveTier(ep)
    return userLevel >= TIER_ORDER[effective]
  })

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <header className="mb-14 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-muted mb-3">
          Arc {arc.arcNumber} — {arc.title}
        </p>
        <h1 className="font-display text-4xl tracking-tight">Episodes</h1>
        <p className="mt-3 text-fg-muted leading-relaxed">
          New episode every Monday. Pro members read three days early.
        </p>
      </header>

      {visible.length === 0 ? (
        <EmptyState message="The first episode arrives soon." />
      ) : (
        <ul className="space-y-1">
          {visible.map((ep, i) => (
            <li
              key={ep.id}
              className={`animate-fade-up stagger-${Math.min(i + 1, 5)}`}
            >
              <EpisodeRow
                episodeNumber={ep.episodeNumber}
                title={ep.title ?? 'Untitled'}
                effectiveTier={getEffectiveTier(ep)}
                publishedAt={ep.publishedAt}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function EpisodeRow({
  episodeNumber,
  title,
  effectiveTier,
  publishedAt,
}: {
  episodeNumber: number
  title: string
  effectiveTier: Tier
  publishedAt: Date | null
}) {
  return (
    <Link
      href={`/episodes/${episodeNumber}`}
      className="group flex items-baseline justify-between border-b border-border py-5 hover:border-border-hover transition-colors"
    >
      <div className="flex items-baseline gap-4">
        <span className="text-xs text-fg-muted tabular-nums w-6">
          {String(episodeNumber).padStart(2, '0')}
        </span>
        <h2 className="font-display text-lg group-hover:text-gold transition-colors">
          {title}
        </h2>
        {effectiveTier === 'pro' && (
          <span className="text-[10px] uppercase tracking-widest text-accent border border-accent/30 px-1.5 py-0.5">
            Early
          </span>
        )}
      </div>
      <time className="text-xs text-fg-muted tracking-wider">
        {publishedAt?.toISOString().slice(0, 10) ?? '—'}
      </time>
    </Link>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 animate-fade-up">
      <h1 className="font-display text-4xl tracking-tight mb-4">Episodes</h1>
      <p className="text-fg-muted italic">{message}</p>
    </div>
  )
}
