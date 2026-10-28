'use client'
// One place for language. English mode shows English only; Kannada mode shows Kannada only.
//   t(en, vars)      UI text: static dictionary first, then /api/translate (cached) for anything missing
//   tr(text)         translate dynamic text (user contributions, server messages)
//   nm(text)         transliterate names/places typed in Latin script into Kannada script
import { useCallback, useEffect, useState } from 'react'
import { useLS, ENTRIES, REGIONS } from './data'
import { DICT } from './dict'
import { REGION_KN, REGION_NOTE_KN, DISTRICT_KN } from './kn'

// Meanings of the built-in entries: the Mysuru (standard-leaning) Kannada for each English sentence.
const MEANING_KN: Record<string, string> = (() => {
  const m: Record<string, string> = {}
  for (const e of ENTRIES) if (e.region === 'mysuru' && !m[e.en]) m[e.en] = e.kn
  return m
})()

type Mode = 'translate' | 'translit'
const cache = new Map<string, string>()
const pending = new Set<string>()
const failed = new Set<string>()
const subs = new Set<() => void>()
let timer: any = null, loaded = false, saveT: any = null
const CK = 'nk_tr_v1'

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try { const o = JSON.parse(localStorage.getItem(CK) || '{}'); for (const k in o) cache.set(k, o[k]) } catch {}
}
function save() {
  clearTimeout(saveT)
  saveT = setTimeout(() => { try { localStorage.setItem(CK, JSON.stringify(Object.fromEntries(Array.from(cache).slice(-1500)))) } catch {} }, 500)
}
const notify = () => subs.forEach(f => f())

async function flush() {
  timer = null
  const keys = Array.from(pending); pending.clear()
  for (const mode of ['translate', 'translit'] as Mode[]) {
    const texts = keys.filter(k => k.startsWith(mode + '|')).map(k => k.slice(mode.length + 1))
    for (let i = 0; i < texts.length; i += 30) {
      const chunk = texts.slice(i, i + 30)
      try {
        const r = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, texts: chunk }) })
        const { result } = await r.json()
        for (const tx of chunk) { if (result?.[tx]) cache.set(mode + '|' + tx, result[tx]); else failed.add(mode + '|' + tx) }
      } catch { chunk.forEach(tx => failed.add(mode + '|' + tx)) }
    }
  }
  save(); notify()
}
function lookup(text: string, mode: Mode): string {
  load()
  const k = mode + '|' + text
  const hit = cache.get(k); if (hit) return hit
  if (!failed.has(k) && !pending.has(k)) { pending.add(k); if (!timer) timer = setTimeout(flush, 40) }
  return text
}

const hasLatin = (s: string) => /[A-Za-z]/.test(s)
const fill = (s: string, v?: Record<string, any>) => s.replace(/\{(\w+)\}/g, (_, k) => (v && v[k] !== undefined ? String(v[k]) : ''))

export function useI18n() {
  const [lang, setLangRaw] = useLS<string>('lang', 'en')
  const [, tick] = useState(0)
  useEffect(() => { const f = () => tick(x => x + 1); subs.add(f); return () => { subs.delete(f) } }, [])
  const kn = lang === 'kn'
  useEffect(() => { if (typeof document !== 'undefined') document.documentElement.lang = kn ? 'kn' : 'en' }, [kn])
  const setLang = useCallback((l: string) => setLangRaw(l), [setLangRaw])

  /** Translate dynamic English text (anything not in the dictionary). */
  const tr = (text: string): string => {
    if (!kn || !text) return text
    if (!hasLatin(text)) return text
    return DICT[text] || MEANING_KN[text] || lookup(text, 'translate')
  }
  /** UI string with optional {placeholders}. */
  const t = (en: string, vars?: Record<string, any>): string => {
    if (!kn) return fill(en, vars)
    const d = DICT[en]
    if (d) return fill(d, vars)
    // Variables that are themselves display text (e.g. region names) are already localised by callers.
    return fill(tr(fill(en, vars)), undefined)
  }
  /** Names / places typed in Latin script -> Kannada script. */
  const nm = (text: string): string => (!kn || !text || !hasLatin(text) ? text : lookup(text, 'translit'))
  const region = (id: string) => { const r = REGIONS.find(x => x.id === id); return !r ? id : kn ? REGION_KN[id] || r.n : r.n }
  const regionNote = (id: string) => { const r = REGIONS.find(x => x.id === id); return !r ? '' : kn ? REGION_NOTE_KN[id] || r.note : r.note }
  const district = (d: string) => (kn ? DISTRICT_KN[d] || nm(d) : d)
  return { lang, kn, setLang, t, tr, nm, region, regionNote, district }
}

/** Transliterate on demand (used by inputs in Kannada mode so typed names become Kannada script). */
export async function transliterate(text: string): Promise<string> {
  if (!hasLatin(text)) return text
  try {
    const r = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'translit', texts: [text] }) })
    const { result } = await r.json(); return result?.[text] || text
  } catch { return text }
}
