export function nextMonday(from: Date = new Date()): Date {
  const date = new Date(from)
  const dayOfWeek = date.getUTCDay()
  const daysUntilMonday = ((8 - dayOfWeek) % 7) || 7

  date.setUTCDate(date.getUTCDate() + daysUntilMonday)
  date.setUTCHours(9, 0, 0, 0)

  return date
}
