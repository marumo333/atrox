export interface ParsedEpisode {
  title: string | null
  body: string
}

/**
 * Parses a Claude-generated episode body and extracts:
 * - title from patterns like "### Episode N: *Title*" or "## Title"
 * - cleaned body with the title header stripped
 *
 * Claude tends to open episodes with a series header followed by
 * an episode title and a horizontal rule:
 *
 *   # Court of Thorns
 *   ### Episode Two: *What the Debt Holds*
 *
 *   ---
 *
 *   She did not sleep.
 *
 * We extract "What the Debt Holds" as the title and return everything
 * after the first horizontal rule as the body.
 */
export function parseEpisode(raw: string): ParsedEpisode {
  const title = extractTitle(raw)
  const body = stripHeader(raw)
  return { title, body }
}

function extractTitle(raw: string): string | null {
  // Pattern 1: "### Episode N: *Title*"
  const italicMatch = raw.match(
    /^#{2,4}\s+Episode\s+[\w-]+(?:[:\s]+)\*(.+?)\*/m,
  )
  if (italicMatch?.[1]) return italicMatch[1].trim()

  // Pattern 2: "### Episode N: Title" (no asterisks)
  const plainMatch = raw.match(/^#{2,4}\s+Episode\s+[\w-]+[:\s]+(.+)$/m)
  if (plainMatch?.[1]) {
    return plainMatch[1].replace(/\*+/g, '').trim()
  }

  // Pattern 3: first H1 after a series title
  const h1Lines = raw.match(/^#{1,2}\s+(.+)$/gm)
  if (h1Lines && h1Lines.length >= 2) {
    // Second heading is likely the episode title
    const second = h1Lines[1]
    if (second) {
      return second
        .replace(/^#+\s+/, '')
        .replace(/\*+/g, '')
        .trim()
    }
  }

  return null
}

function stripHeader(raw: string): string {
  // Split on first horizontal rule (---) surrounded by blank lines
  const parts = raw.split(/\n\s*---\s*\n/)
  if (parts.length >= 2) {
    // Everything after the first --- is the body
    return parts.slice(1).join('\n\n---\n\n').trim()
  }
  return raw.trim()
}
