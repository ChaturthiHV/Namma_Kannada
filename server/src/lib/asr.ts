import { config } from '../config'

export const asrAvailable = () => !!config.asr.url

/** Sends audio to an OpenAI-compatible transcription endpoint and returns the Kannada text. */
export async function transcribe(buf: Buffer, mime: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', new Blob([buf as any], { type: mime }), 'audio.' + (mime.split('/')[1] || 'webm'))
  fd.append('model', config.asr.model)
  fd.append('language', 'kn')
  const r = await fetch(config.asr.url, {
    method: 'POST',
    headers: config.asr.key ? { Authorization: 'Bearer ' + config.asr.key } : {},
    body: fd,
    signal: AbortSignal.timeout(30000),
  })
  if (!r.ok) throw new Error('ASR service returned ' + r.status)
  const d: any = await r.json()
  return String(d.text || '')
}

const norm = (s: string) => s.normalize('NFC').toLowerCase().replace(/[\s\u200c\u200d.,!?;:'"()\-?]/g, '')

function lev(a: string, b: string) {
  const m = a.length, n = b.length
  let prev = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    prev = cur
  }
  return prev[n]
}

/** 0-100 text similarity between what was said and what was expected. Approximate by nature. */
export function similarity(said: string, expected: string) {
  const a = norm(said), b = norm(expected)
  if (!a || !b) return 0
  return Math.round(100 * (1 - lev(a, b) / Math.max(a.length, b.length)))
}
