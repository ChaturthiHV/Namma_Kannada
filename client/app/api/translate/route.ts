import { NextResponse } from 'next/server'

// Translation + transliteration proxy (keeps API keys server-side and avoids CORS).
// 1. If GOOGLE_TRANSLATE_API_KEY is set -> Google Cloud Translation v2 (best quality).
// 2. Otherwise -> Google's public gtx endpoint (no key, fine for a demo).
// Names/places are transliterated (Latin -> Kannada script) with Google Input Tools.
export const runtime = 'nodejs'
const mem = new Map<string, string>()
const KEY = process.env.GOOGLE_TRANSLATE_API_KEY

async function translateOne(text: string): Promise<string> {
  if (KEY) {
    const r = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'en', target: 'kn', format: 'text' }),
    })
    const d = await r.json()
    const out = d?.data?.translations?.[0]?.translatedText
    if (out) return out
    throw new Error('translate failed')
  }
  const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=kn&dt=t&q=${encodeURIComponent(text)}`)
  const d = await r.json()
  const out = (d?.[0] || []).map((s: any) => s?.[0] || '').join('')
  if (out) return out
  throw new Error('translate failed')
}

async function translitOne(text: string): Promise<string> {
  // Transliterate word by word so multi-word names keep their spacing.
  const words = text.split(/(\s+)/)
  const out = await Promise.all(words.map(async w => {
    if (!w.trim() || !/[A-Za-z]/.test(w)) return w
    const r = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(w)}&itc=kn-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=namma`)
    const d = await r.json()
    return d?.[0] === 'SUCCESS' ? d[1]?.[0]?.[1]?.[0] || w : w
  }))
  return out.join('')
}

export async function POST(req: Request) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }
  const mode: 'translate' | 'translit' = body?.mode === 'translit' ? 'translit' : 'translate'
  const texts: string[] = Array.isArray(body?.texts) ? body.texts.filter((x: any) => typeof x === 'string').slice(0, 40) : []
  const result: Record<string, string> = {}
  await Promise.all(texts.map(async tx => {
    const s = tx.slice(0, 600); const ck = mode + '|' + s
    if (mem.has(ck)) { result[tx] = mem.get(ck)!; return }
    try { const o = mode === 'translit' ? await translitOne(s) : await translateOne(s); mem.set(ck, o); result[tx] = o } catch { /* leave missing: client falls back to original */ }
  }))
  return NextResponse.json({ result })
}
