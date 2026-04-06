import Link from "next/link";

interface Episode {
  episodeNumber: number;
  title: string;
  publishedAt: string;
  tier: string;
}

const PLACEHOLDER_EPISODES: Episode[] = [
  {
    episodeNumber: 1,
    title: "The Invitation",
    publishedAt: "2026-04-07",
    tier: "free",
  },
  {
    episodeNumber: 2,
    title: "A Name Spoken in Smoke",
    publishedAt: "2026-04-14",
    tier: "free",
  },
  {
    episodeNumber: 3,
    title: "The Court of Thorns",
    publishedAt: "2026-04-21",
    tier: "pro",
  },
];

export default function EpisodesPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold">Episodes</h1>
      <p className="mb-10 text-muted-foreground">
        New episode every Monday. Pro members read 3 days early.
      </p>
      <ul className="space-y-4">
        {PLACEHOLDER_EPISODES.map((ep) => (
          <EpisodeCard key={ep.episodeNumber} episode={ep} />
        ))}
      </ul>
    </div>
  );
}

function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <li>
      <Link
        href={`/episodes/${episode.episodeNumber}`}
        className="flex items-center justify-between rounded border border-muted p-4 hover:border-muted-foreground"
      >
        <div>
          <span className="text-sm text-muted-foreground">
            Episode {episode.episodeNumber}
          </span>
          <h2 className="text-lg font-medium">{episode.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          {episode.tier === "pro" && (
            <span className="rounded bg-accent px-2 py-0.5 text-xs">PRO</span>
          )}
          <span className="text-sm text-muted-foreground">
            {episode.publishedAt}
          </span>
        </div>
      </Link>
    </li>
  );
}
