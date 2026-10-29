'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import RegionMap from '@/components/RegionMap'
import { PageHead, Play, Phrase } from '@/components/ui'
import { REGIONS, useEntries, useLS } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
export default function MapPage() {
 const L = useI18n(); const { t } = L; const { all } = useEntries(); const [sel, setSel] = useState('mysuru'); const [done, setDone] = useLS<string[]>('explored', [])
 const r = REGIONS.find(x => x.id === sel) ?? REGIONS[0]; const list = all.filter(e => e.region === sel)
 const pick = (id: string) => { setSel(id); if (!done.includes(id)) setDone([...done, id]) }
 const seen = REGIONS.filter(x => done.includes(x.id)).length
 return (
  <div className="p-4 sm:p-5"><PageHead en="Explore Karnataka Map" kn="ಕರ್ನಾಟಕ ನಕ್ಷೆ" sub={t('Dialects are a continuum; regions are dialect areas, not hard borders.')} />
   <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
    <div className="card lg:sticky lg:top-5">
     <div className="rounded-xl bg-page p-3"><RegionMap sel={sel} onPick={pick} done={done} className="mx-auto h-[20rem] w-full sm:h-[24rem] lg:h-[calc(100vh-17rem)] lg:max-h-[34rem] lg:min-h-[22rem]" /></div>
     <ul className="mt-4 grid gap-2 sm:grid-cols-2">{REGIONS.map(x => <li key={x.id}><button onClick={() => pick(x.id)} aria-pressed={sel === x.id} className={`chip flex w-full items-center gap-2 !rounded-lg !px-3 !py-2 text-left ${sel === x.id ? 'on' : ''}`}><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: x.c }} /><span className="flex-1">{L.region(x.id)}</span>{done.includes(x.id) && <span aria-hidden>✓</span>}</button></li>)}</ul>
     <p className="mt-3 text-xs text-muted">{t('{a} of {b} regions explored', { a: seen, b: REGIONS.length })}</p></div>
    <div className="card min-w-0">
     <div className="mb-4 flex items-start gap-3 border-b border-border pb-4"><span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: r.c }} /><div className="min-w-0"><h2 className="font-display text-2xl font-bold leading-tight text-maroon dark:text-gold">{L.region(r.id)}</h2><p className="mt-1 text-sm text-muted">{t('Spoken mainly in: {note}', { note: L.regionNote(r.id) })}</p></div></div>
     {list.length === 0 ? <div className="rounded-xl border border-dashed border-border p-6 text-center"><p className="text-sm">{t('No words yet. Be the first to contribute!')}</p><Link href="/contribute" className="btn2 mt-3"><Plus size={14} />{t('Contribute a Word')}</Link></div>
     : <div className="grid gap-3 xl:grid-cols-2">{list.map(e => <div key={e.id} className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-surface2 p-3"><Phrase e={e} /><Play t={e.kn} src={e.audio} /></div>)}</div>}</div>
   </div></div>
 )
}
