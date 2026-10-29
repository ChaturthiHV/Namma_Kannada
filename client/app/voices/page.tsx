'use client'
import { useState } from 'react'
import { PageHead, Play, Phrase } from '@/components/ui'
import { useEntries } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
export default function Voices() {
 const L = useI18n(); const { t, tr } = L; const { all } = useEntries(); const [c, setC] = useState('c1'); const l = all.filter(e => e.concept === c)
 return (
  <div className="p-4 sm:p-5"><PageHead en="Regional Voice Gallery" kn="ಧ್ವನಿ ಗ್ಯಾಲರಿ" sub={t('Same phrase, different voices. Tap play to hear each phrase; community recordings play when available.')} />
   <div className="mb-4 flex flex-wrap gap-2">{Array.from(new Set(all.map(e => e.concept))).map(k => <button key={k} onClick={() => setC(k)} className={`chip ${c === k ? 'on' : ''}`}>{tr(all.find(e => e.concept === k)!.en)}</button>)}</div>
   <div className="grid gap-4 md:grid-cols-2">{l.map(e => <div key={e.id} className="card flex items-center gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-maroon text-white">{L.region(e.region)[0]}</div><div className="min-w-0 flex-1"><div className="text-xs font-semibold text-muted">{L.region(e.region)}</div><Phrase e={e} /></div><Play t={e.kn} src={e.audio} /></div>)}</div></div>
 )
}
