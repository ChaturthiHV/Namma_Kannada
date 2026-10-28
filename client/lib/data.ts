'use client'
import { useEffect, useState } from 'react'
import { API, api, pushState } from './api'
import { REGION_PATHS } from './karnataka-geo'
import { SENTENCE_ENTRIES } from './sentences'
export const REGIONS = [
  { id: 'north', n: 'Dharwad–North Karnataka Kannada', c: '#f7c325', note: 'Belagavi, Bagalkote, Vijayapura, Dharwad, Gadag, Haveri, parts of Uttara Kannada and Ballari (map also places Davanagere, Chitradurga here)', w: 260, p: REGION_PATHS.north },
  { id: 'hk', n: 'Kalaburagi–Hyderabad Karnataka Kannada', c: '#f59e0b', note: 'Kalaburagi, Bidar, Yadgir, Raichur, Koppal, parts of Vijayanagara and Ballari', w: 60, p: REGION_PATHS.hk },
  { id: 'mysuru', n: 'Mysuru–Southern Kannada', c: '#e0452b', note: 'Mysuru, Mandya, Chamarajanagar, Hassan, Tumakuru, Ramanagara, Chikkaballapur, Kolar', w: 420, p: REGION_PATHS.mysuru },
  { id: 'bengaluru', n: 'Bengaluru Kannada', c: '#7c3aed', note: 'Bengaluru Urban, Bengaluru Rural; urban colloquial speech shaped by multilingual communities (also spills into Ramanagara, Kolar, Chikkaballapur)', w: 200, p: REGION_PATHS.bengaluru },
  { id: 'coastal', n: 'Coastal Kannada (Karavali Kannada)', c: '#0e8fa3', note: 'Dakshina Kannada, Udupi, coastal Uttara Kannada; Mangaluru Kannada, Kundagannada', w: 310, p: REGION_PATHS.coastal },
  { id: 'malnad', n: 'Malenadu Kannada', c: '#2f8f4e', note: 'Shivamogga, Chikkamagaluru, Kodagu, parts of Hassan and Uttara Kannada; Havyaka Kannada', w: 120, p: REGION_PATHS.malnad },
]
// PLACEHOLDER seed data: must be verified by native speakers before the demo.
const E = (i, c, en, region, kn, rom, status = 'verified') => ({ id: 'e' + i, concept: c, en, region, kn, rom, status, ctx: 'Everyday' })
export const ENTRIES = [
 E(1, 'c1', 'What are you doing?', 'mysuru', 'ಏನ್ ಮಾಡ್ತಿದ್ದೀಯ?', 'En maadtidiya?'),
 E(2, 'c1', 'What are you doing?', 'north', 'ಏನ್ ಮಾಡಾಕತ್ತೀ?', 'En maadakatti?'),
 E(3, 'c1', 'What are you doing?', 'coastal', 'ಎಂತ ಮಾಡ್ತೀ?', 'Entha maadthi?'),
 E(4, 'c2', 'Where are you going?', 'mysuru', 'ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀಯ?', 'Elli hogtidiya?'),
 E(5, 'c2', 'Where are you going?', 'north', 'ಎಲ್ಲಿಗೆ ಹೊಂಟೀ?', 'Elli hontee?'),
 E(6, 'c2', 'Where are you going?', 'coastal', 'ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀಯ?', 'Ellige hogtiddiya?'),
 E(7, 'c3', 'Have you eaten?', 'mysuru', 'ಊಟ ಆಯ್ತಾ?', 'Oota aayta?'),
 E(8, 'c3', 'Have you eaten?', 'north', 'ಊಟ ಆತೇನ್ರಿ?', 'Oota aatenri?'),
 E(9, 'c3', 'Have you eaten?', 'coastal', 'ಊಟ ಆಯ್ತಾ?', 'Oota aayta?', 'pending'),
 E(10, 'c4', 'Come here', 'mysuru', 'ಇಲ್ಲಿ ಬಾ', 'Illi baa'),
 E(11, 'c4', 'Come here', 'north', 'ಇಲ್ಲೆ ಬಾ', 'Ille baa'),
 E(12, 'c4', 'Come here', 'malnad', 'ಇಲ್ಲಿ ಬನ್ನಿ', 'Illi banni', 'pending'),
 E(13, 'c5', 'Salt', 'coastal', 'ಉಪ್ಪು', 'Uppu'),
 E(14, 'c6', 'Water', 'mysuru', 'ನೀರು', 'Neeru'),
 E(15, 'c6', 'Water', 'coastal', 'ನೀರ್', 'Neer'),
 ...SENTENCE_ENTRIES,
]
export function useLS<T>(k: string, init: T): [T, (v: T) => void] {
 const [v, s] = useState<T>(init)
 useEffect(() => {
  const r = () => { try { const x = localStorage.getItem(k); if (x) s(JSON.parse(x)) } catch {} }
  r(); window.addEventListener('ls:' + k, r); return () => window.removeEventListener('ls:' + k, r)
 }, [k])
 return [v, (n: T) => { s(n); try { localStorage.setItem(k, JSON.stringify(n)) } catch {}; pushState(k, n); window.dispatchEvent(new Event('ls:' + k)) }]
}
/** Approvals from speakers of the same dialect needed before a contribution shows as Verified. */
export const VOTES_NEEDED = 10
export function useEntries() {
 const [x, setX] = useLS<any[]>('extra', [])
 const [votes, setVotes] = useLS<Record<string, string[]>>('votes', {}) // demo mode only: entryId -> voter phones
 const [db, setDb] = useState<any[] | null>(null)
 useEffect(() => { if (API) { api('/entries').then(d => setDb(d.entries)).catch(() => {}); return } }, [])
 const m = new Map(x.map(e => [e.id, e]))
 const withAudio = (e: any) => (e.audio || !e.audioPath) ? e : { ...e, audio: /^https?:/.test(e.audioPath) ? e.audioPath : (API || '') + e.audioPath }
 const raw = (db ? db.map(withAudio) : null) ?? [...ENTRIES.map(e => m.get(e.id) || e), ...x.filter(e => !ENTRIES.some(b => b.id === e.id))]
 // A pending entry is shown as verified only after VOTES_NEEDED approvals; otherwise it stays pending.
 const base = raw.map((e: any) => {
  const n = db ? (e.votes ?? 0) : (votes[e.id] || []).length
  return { ...e, votes: n, status: !db && e.status === 'pending' && n >= VOTES_NEEDED ? 'verified' : e.status }
 })
 const set = async (e: any) => {
  if (API && db) {
   try {
    const known = db.some(a => a.id === e.id)
    const { entry } = known ? await api(`/entries/${e.id}/status`, { method: 'PATCH', json: { status: e.status } }) : await api('/entries', { method: 'POST', json: { kn: e.kn, en: e.en, region: e.region, ctx: e.ctx, example: e.ex } })
    if (!known && e.blob) { // attach the voice recording so other people can hear it
     try { const fd = new FormData(); fd.append('audio', e.blob, 'recording.' + (e.blob.type.includes('mp4') ? 'm4a' : e.blob.type.includes('ogg') ? 'ogg' : 'webm')); fd.append('consent', 'true'); fd.append('duration', String(e.dur || 0)); const { audio } = await api(`/entries/${entry.id}/audio`, { method: 'POST', body: fd }); entry.audio = audio.url } catch (x: any) { console.warn(x.message) }
    }
    return setDb(known ? db.map(a => a.id === entry.id ? entry : a) : [...db.filter(a => a.id !== entry.id), entry])
   } catch (err: any) { if (err.status) return console.warn(err.message) } // server said no (e.g. not a reviewer)
  }
  const { blob, ...keep } = e
  setX([...x.filter(a => a.id !== e.id), keep])
 }
 const hasVoted = (e: any, u: any) => !!u && (db ? !!e.voted : (votes[e.id] || []).includes(u.phone))
 // Approve a pending entry. Only speakers of the same dialect can vote, once each, and never on their own entry.
 // L = { t, region } from useI18n so messages come back in the active language.
 const vote = async (e: any, u: any, L: { t: (en: string, v?: any) => string; region: (id: string) => string } = { t: (s: string, v?: any) => s.replace(/\{(\w+)\}/g, (_, k) => v?.[k] ?? ''), region: rn }): Promise<{ msg: string; err?: boolean }> => {
  const { t } = L, name = L.region(e.region)
  if (!u) return { msg: t('Please log in to approve.'), err: true }
  if (e.status !== 'pending') return { msg: t('This entry is already verified.'), err: true }
  if (u.region !== e.region) return { msg: t('Only {name} speakers can approve this.', { name }), err: true }
  if (db) {
   try {
    const { entry } = await api(`/entries/${e.id}/vote`, { method: 'POST' })
    setDb(db.map(a => a.id === entry.id ? { ...a, ...entry, voted: true } : a))
    return { msg: entry.status === 'verified' ? t('Verified! {n} speakers approved it.', { n: VOTES_NEEDED }) : t('Approved. {a}/{b} approvals so far.', { a: entry.votes, b: VOTES_NEEDED }) }
   } catch (err: any) { return { msg: err.status ? t(err.message) : t('Cannot reach the server. Please try again.'), err: true } }
  }
  if (e.by && e.by === u.phone) return { msg: t("You can't approve your own contribution."), err: true }
  const list = votes[e.id] || []
  if (list.includes(u.phone)) return { msg: t('You have already approved this.'), err: true }
  setVotes({ ...votes, [e.id]: [...list, u.phone] })
  return { msg: list.length + 1 >= VOTES_NEEDED ? t('Verified! {n} speakers approved it.', { n: VOTES_NEEDED }) : t('Approved. {a}/{b} approvals so far.', { a: list.length + 1, b: VOTES_NEEDED }) }
 }
 return { all: base.filter(e => e.status !== 'rejected'), set, vote, hasVoted }
}
export const rn = (id: string) => REGIONS.find(r => r.id === id)?.n || id
/** Stable key for a Kannada string -> /audio/<key>.mp3 (same function as scripts/gen-audio.mjs). */
export const normText = (s: string) => s.replace(/[“”"]/g, '').replace(/\s+/g, ' ').trim()
export const audioKey = (str: string) => { // cyrb53
 let h1 = 0xdeadbeef, h2 = 0x41c6ce57
 for (let i = 0; i < str.length; i++) { const ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677) }
 h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
 h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
 return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}
const deviceTts = (t: string) => { try { const u = new SpeechSynthesisUtterance(t); u.lang = 'kn-IN'; speechSynthesis.cancel(); speechSynthesis.speak(u) } catch {} }
let current: HTMLAudioElement | null = null
/** Plays `src` (a community recording) if given, else the pre-generated clip for this text, else the device voice. Resolves when finished. */
export function speak(text: string, src?: string): Promise<boolean> {
 if (typeof window === 'undefined') return Promise.resolve(false)
 try { current?.pause(); speechSynthesis?.cancel() } catch {}
 return new Promise<boolean>(resolve => {
  const urls = [src, `/audio/${audioKey(normText(text))}.mp3`].filter(Boolean) as string[]
  const tryNext = () => {
   const u = urls.shift()
   if (!u) { console.warn('[audio] no playable clip for:', text); if ('speechSynthesis' in window && speechSynthesis.getVoices().some(v => /^kn/i.test(v.lang))) { deviceTts(text); return resolve(true) } return resolve(false) }
   const a = new Audio(u); current = a; let moved = false
   const fail = () => { if (moved) return; moved = true; tryNext() }
   a.onerror = fail; a.onended = () => resolve(true)
   a.play().catch(e => { if (e?.name === 'NotAllowedError' || e?.name === 'AbortError') { moved = true; resolve(false) } else fail() })
  }
  tryNext()
 })
}
