import Link from 'next/link'

interface Episode {
  episodeNumber: number
  title: string
  publishedAt: string
  tier: string
}

const PLACEHOLDER_EPISODES: Episode[] = [
  {
    episodeNumber: 1,
    title: 'The Invitation',
    publishedAt: '2026-04-07',
    tier: 'free',
  },
  {
    episodeNumber: 2,
    title: 'A Name Spoken in Smoke',
    publishedAt: '2026-04-14',
    tier: 'free',
  },
  {
    episodeNumber: 3,
    title: 'The Court of Thorns',
    publishedAt: '2026-04-21',
    tier: 'pro',
  },
]

export default function EpisodesPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <header className="mb-14 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-muted mb-3">
          Arc I
        </p>
        <h1 className="font-display text-4xl tracking-tight">Episodes</h1>
        <p className="mt-3 text-fg-muted leading-relaxed">
          New episode every Monday. Pro members read three days early.
        </p>
      </header>

      <ul className="space-y-1">
        {PLACEHOLDER_EPISODES.map((ep, i) => (
          <li
            key={ep.episodeNumber}
            className={`animate-fade-up stagger-${i + 1}`}
          >
            <EpisodeRow episode={ep} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function EpisodeRow({ episode }: { episode: Episode }) {
  return (
    <Link
      href={`/episodes/${episode.episodeNumber}`}
      className="group flex items-baseline justify-between border-b border-border py-5 hover:border-border-hover transition-colors"
    >
      <div className="flex items-baseline gap-4">
        <span className="text-xs text-fg-muted tabular-nums w-6">
          {String(episode.episodeNumber).padStart(2, '0')}
        </span>
        <h2 className="font-display text-lg group-hover:text-gold transition-colors">
          {episode.title}
        </h2>
        {episode.tier === 'pro' && (
          <span className="text-[10px] uppercase tracking-widest text-accent border border-accent/30 px-1.5 py-0.5">
            Pro
          </span>
        )}
      </div>
      <time className="text-xs text-fg-muted tracking-wider">
        {episode.publishedAt}
      </time>
    </Link>
  )
}
