interface WeightedComment {
  body: string
  weight: number
  createdAt: Date
}

export function sortCommentsByWeight<T extends WeightedComment>(
  comments: T[],
  limit?: number,
): T[] {
  const sorted = [...comments].sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight
    return b.createdAt.getTime() - a.createdAt.getTime()
  })

  return limit ? sorted.slice(0, limit) : sorted
}
