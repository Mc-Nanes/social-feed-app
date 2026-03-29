const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'always',
})

const timeDivisions = [
  { unit: 'year', amount: 1000 * 60 * 60 * 24 * 365 },
  { unit: 'month', amount: 1000 * 60 * 60 * 24 * 30 },
  { unit: 'day', amount: 1000 * 60 * 60 * 24 },
  { unit: 'hour', amount: 1000 * 60 * 60 },
  { unit: 'minute', amount: 1000 * 60 },
  { unit: 'second', amount: 1000 },
] as const

export function formatRelativeTime(dateTime: string) {
  const timestamp = new Date(dateTime).getTime()

  if (Number.isNaN(timestamp)) {
    return 'Just now'
  }

  const elapsed = timestamp - Date.now()

  if (elapsed > 0) {
    return 'Just now'
  }

  for (const division of timeDivisions) {
    if (Math.abs(elapsed) >= division.amount || division.unit === 'second') {
      return relativeTimeFormatter.format(
        Math.round(elapsed / division.amount),
        division.unit,
      )
    }
  }

  return 'Just now'
}
