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
 E(6, 'c2', 'Where are you going?', 'coastal', 'ಎಲ್ಲಿಗೆ ಹೋಪುದು?', 'Elli hopudu?'),
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
export function useEntries() {
 const [x, setX] = useLS<any[]>('extra', [])
 const [db, setDb] = useState<any[] | null>(null)
 useEffect(() => { if (API) { api('/entries').then(d => setDb(d.entries)).catch(() => {}); return } }, [])
 const m = new Map(x.map(e => [e.id, e]))
 const base = db ?? [...ENTRIES.map(e => m.get(e.id) || e), ...x.filter(e => !ENTRIES.some(b => b.id === e.id))]
 const set = async (e: any) => {
  if (API && db) {
   try {
    const known = db.some(a => a.id === e.id)
    const { entry } = known ? await api(`/entries/${e.id}/status`, { method: 'PATCH', json: { status: e.status } }) : await api('/entries', { method: 'POST', json: { kn: e.kn, en: e.en, region: e.region, rom: e.rom, ctx: e.ctx } })
    return setDb(known ? db.map(a => a.id === entry.id ? entry : a) : [...db.filter(a => a.id !== entry.id), entry])
   } catch (err: any) { if (err.status) return console.warn(err.message) } // server said no (e.g. not a reviewer)
  }
  setX([...x.filter(a => a.id !== e.id), e])
 }
 return { all: base.filter(e => e.status !== 'rejected'), set }
}
export const rn = (id: string) => REGIONS.find(r => r.id === id)?.n || id
export const speak = (t: string) => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(t); u.lang = 'kn-IN'; speechSynthesis.cancel(); speechSynthesis.speak(u) } }
