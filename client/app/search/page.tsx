'use client'
import { useState } from 'react'
import { PageHead, Play, Phrase } from '@/components/ui'
import { useEntries, REGIONS, rn } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
const norm = (s: string) => s.toLowerCase().replace(/(.)\1+/g, '$1').replace(/[aeiou]/g, m => m).replace(/h/g, '').replace(/[^a-z\u0c80-\u0cff ]/g, '')
export default function Search() {
 const L = useI18n(); const { t, tr } = L; const { all } = useEntries(); const [q, setQ] = useState(''); const [tab, setTab] = useState('All')
 const hit = all.filter(e => !q || [e.kn, e.rom, e.en, tr(e.en), rn(e.region), L.region(e.region)].some(x => norm(x).includes(norm(q))))
 const words = (e: any) => e.en.split(' ').length <= 2
 const shown = hit.filter(e => tab === 'All' || (tab === 'Words' && words(e)) || (tab === 'Phrases' && !words(e)))
 const regs = REGIONS.filter(r => q && [r.n, L.region(r.id)].some(x => x.toLowerCase().includes(q.toLowerCase())))
 const groups = Array.from(new Set(shown.map(e => e.concept)))
 return (
  <div className="p-5"><PageHead en="Smart Search" kn="ಹುಡುಕಾಟ" sub={t('Kannada script, English or spelling variants like hogona / hogona.')} />
   <input autoFocus className="inp mb-3 max-w-xl" placeholder={t('Search words, phrases, regions…')} value={q} onChange={e => setQ(e.target.value)} aria-label={t('Search')} />
   <div className="mb-4 flex gap-2">{['All', 'Words', 'Phrases', 'Regions'].map(x => <button key={x} onClick={() => setTab(x)} className={`chip ${tab === x ? 'on' : ''}`}>{t(x)}</button>)}</div>
   {(tab === 'Regions' || tab === 'All') && regs.map(r => <p key={r.id} className="mb-2 text-sm">📍 {L.region(r.id)} — {L.regionNote(r.id)}</p>)}
   {tab !== 'Regions' && <div className="grid gap-4 md:grid-cols-2">{groups.map(c => <div key={c} className="card"><div className="mb-2 text-xs font-semibold text-muted">{tr(shown.find(e => e.concept === c)!.en)}</div>
    {shown.filter(e => e.concept === c).map(e => <div key={e.id} className="mb-2 flex items-center justify-between border-t border-border pt-2"><div><span className="chip mb-1 inline-block">{L.region(e.region)}</span><Phrase e={e} /></div><Play t={e.kn} src={e.audio} /></div>)}</div>)}
    {!groups.length && <p className="text-sm">{t('No results. Try a different spelling or contribute this word.')}</p>}</div>}
  </div>
 )
}
