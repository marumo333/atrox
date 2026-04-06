const MAX_COMMENT_LENGTH = 500

const BLOCKED_PATTERNS = [
  /ignore\s+(previous|above|all)\s+instructions/i,
  /you\s+are\s+now/i,
  /system\s*prompt/i,
  /\bact\s+as\b/i,
  /<\/?system>/i,
]

export function sanitizeComment(body: string): string {
  let cleaned = body.slice(0, MAX_COMMENT_LENGTH)

  for (const pattern of BLOCKED_PATTERNS) {
    cleaned = cleaned.replace(pattern, '[filtered]')
  }

  // Escape XML-like tags that could confuse prompt parsing
  cleaned = cleaned.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return cleaned
}

export function sanitizeComments(
  comments: { body: string }[],
): { body: string }[] {
  return comments.map((c) => ({ body: sanitizeComment(c.body) }))
}
