'use client'
import { useEffect, useState } from 'react'
import { API, api, pushState } from './api'
export const REGIONS = [
 { id: 'mysuru', n: 'Mysuru', c: '#e0452b', note: 'Mysuru, Mandya, Chamarajanagar', w: 420, p: 'M120 190 L170 175 L190 215 L150 245 L115 225Z' },
 { id: 'coastal', n: 'Coastal Karnataka', c: '#f08a24', note: 'Dakshina Kannada, Udupi, Uttara Kannada', w: 310, p: 'M70 110 L100 120 L105 190 L90 230 L70 180Z' },
 { id: 'north', n: 'North Karnataka', c: '#f7c325', note: 'Dharwad, Belagavi, Vijayapura', w: 260, p: 'M120 20 L180 15 L200 70 L150 95 L110 60Z' },
 { id: 'malnad', n: 'Malnad', c: '#8e1015', note: 'Shivamogga, Chikkamagaluru', w: 120, p: 'M100 120 L150 110 L165 170 L120 190 L105 165Z' },
 { id: 'hk', n: 'Hyderabad-Karnataka', c: '#f59e0b', note: 'Kalaburagi, Raichur, Ballari', w: 60, p: 'M150 95 L200 70 L230 120 L190 150 L155 130Z' },
 { id: 'kodagu', n: 'Kodagu Borders', c: '#f4795f', note: 'Kodagu, Hassan border', w: 40, p: 'M115 225 L150 245 L140 275 L105 255Z' },
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
