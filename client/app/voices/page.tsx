'use client'
import { useState } from 'react'
import { PageHead, Play, Wave, Phrase } from '@/components/ui'
import { useEntries, rn } from '@/lib/data'
const META = ['Elder, retired teacher', 'Student, 21', 'Shopkeeper, 38', 'Farmer, 50'] // PLACEHOLDER speakers
export default function Voices() {
 const { all } = useEntries(); const [c, setC] = useState('c1'); const l = all.filter(e => e.concept === c)
 return (
  <div className="p-5"><PageHead en="Regional Voice Gallery" kn="ಧ್ವನಿ ಗ್ಯಾಲರಿ" sub="Same phrase, different voices. Audio uses device text-to-speech until real recordings are added." />
   <div className="mb-4 flex flex-wrap gap-2">{Array.from(new Set(all.map(e => e.concept))).map(k => <button key={k} onClick={() => setC(k)} className={`chip ${c === k ? 'on' : ''}`}>{all.find(e => e.concept === k)!.en}</button>)}</div>
   <div className="grid gap-4 md:grid-cols-2">{l.map((e, i) => <div key={e.id} className="card flex items-center gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-maroon text-white">{rn(e.region)[0]}</div><div className="min-w-0 flex-1"><div className="text-xs text-muted">{rn(e.region)} · {META[i % 4]}</div><Phrase e={e} /><Wave n={16} /></div><Play t={e.kn} /></div>)}</div></div>
 )
}
