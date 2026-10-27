// Very small respectful-content filter. Extend via the BLOCKLIST env var (comma-separated) or swap in a real service.
const BASE = ['slur1', 'abuse1']
const extra = (process.env.BLOCKLIST || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
const LIST = [...BASE, ...extra]

export const isDisrespectful = (...texts: (string | undefined)[]) => {
  const t = texts.filter(Boolean).join(' ').toLowerCase()
  return LIST.some(b => t.includes(b))
}
