'use client'
import { useEffect, useState } from 'react'
import { PageHead, Play, Phrase } from '@/components/ui'
import { API, api } from '@/lib/api'
// PLACEHOLDER dialogue: verify with native speakers.
const LOCAL: any = {
 Shopping: { n0: { w: 'Vendor (Mysuru)', e: { kn: 'ಏನ್ ಬೇಕು?', rom: 'En beku?', en: 'What do you need?' }, c: [['Ask the price', 'n1'], ['Just looking', 'n2']] },
  n1: { w: 'Vendor (Mysuru)', e: { kn: 'ಇಪ್ಪತ್ತು ರೂಪಾಯಿ', rom: 'Ippattu roopaayi', en: 'Twenty rupees' }, c: [['Restart', 'n0']] },
  n2: { w: 'Vendor (Mysuru)', e: { kn: 'ನೋಡಿ, ಬನ್ನಿ', rom: 'Nodi, banni', en: 'Please look around' }, c: [['Restart', 'n0']] } },
 Travelling: { n0: { w: 'Local (North Karnataka)', e: { kn: 'ಎಲ್ಲಿಗೆ ಹೊಂಟೀ?', rom: 'Elli hontee?', en: 'Where are you going?' }, c: [['To the bus stand', 'n1']] },
  n1: { w: 'Local (North Karnataka)', e: { kn: 'ಹಿಂಗೆ ಹೋಗು', rom: 'Hinge hogu', en: 'Go this way' }, c: [['Restart', 'n0']] } },
}
export default function Talk() {
 const [S, setS] = useState<any>(LOCAL)
 useEffect(() => { if (API) api('/scenarios').then(d => Object.keys(d.scenarios || {}).length && setS(d.scenarios)).catch(() => {}) }, [])
 const [tab, setTab] = useState('Shopping'); const [n, setN] = useState('n0'); const s = S[tab][n]
 return (
  <div className="p-5"><PageHead en="Talk to a Local" kn="ಸ್ಥಳೀಯರೊಂದಿಗೆ ಮಾತು" />
   <div className="mb-4 flex flex-wrap gap-2">{['Shopping', 'Travelling', 'Village', 'Elder'].map(t => <button key={t} disabled={!S[t]} onClick={() => { setTab(t); setN('n0') }} className={`chip ${tab === t ? 'on' : ''}`}>{t}{!S[t] && ' (soon)'}</button>)}</div>
   <div className="card max-w-xl space-y-4"><div className="text-xs text-muted">{s.w}</div><div className="flex items-center justify-between rounded-2xl rounded-tl-none bg-surface2 p-4"><Phrase e={s.e} /><Play t={s.e.kn} /></div>
    <div className="flex flex-wrap gap-2">{s.c.map(([t, to]: any) => <button key={t} className="btn" onClick={() => setN(to)}>{t}</button>)}</div></div></div>
 )
}
