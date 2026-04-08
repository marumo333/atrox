interface Comment {
  id: string
  body: string
  weight: number
  createdAt: Date
}

export function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-fg-muted/60 italic text-center py-6">
        No comments yet. Be the first to shape the next episode.
      </p>
    )
  }

  return (
    <ul className="space-y-6">
      {comments.map((c) => (
        <li key={c.id} className="border-b border-border pb-6 last:border-0">
          <div className="flex items-center gap-3 mb-2 text-xs text-fg-muted tracking-wider">
            {c.weight >= 2 && (
              <span className="text-[10px] uppercase text-gold border border-gold/30 px-1.5 py-0.5">
                {c.weight >= 3 ? 'Premium' : 'Pro'}
              </span>
            )}
            <time>{new Date(c.createdAt).toISOString().slice(0, 10)}</time>
          </div>
          <p className="text-fg/85 leading-relaxed whitespace-pre-wrap">
            {c.body}
          </p>
        </li>
      ))}
    </ul>
  )
}
