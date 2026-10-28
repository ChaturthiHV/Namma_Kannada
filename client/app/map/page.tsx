'use client'
import { useState } from 'react'
import RegionMap from '@/components/RegionMap'
import { PageHead, Play, Phrase } from '@/components/ui'
import { REGIONS, useEntries, useLS } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
export default function MapPage() {
 const L = useI18n(); const { t } = L; const { all } = useEntries(); const [sel, setSel] = useState('mysuru'); const [done, setDone] = useLS<string[]>('explored', [])
 const r = REGIONS.find(x => x.id === sel) ?? REGIONS[0]; const list = all.filter(e => e.region === sel)
 const pick = (id: string) => { setSel(id); if (!done.includes(id)) setDone([...done, id]) }
 return (
  <div className="p-5"><PageHead en="Explore Karnataka Map" kn="ಕರ್ನಾಟಕ ನಕ್ಷೆ" sub={t('Dialects are a continuum; regions are dialect areas, not hard borders.')} />
   <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
    <div className="card"><RegionMap sel={sel} onPick={pick} done={done} />
     <ul className="mt-3 flex flex-wrap gap-2">{REGIONS.map(x => <li key={x.id}><button onClick={() => pick(x.id)} className={`chip ${sel === x.id ? 'on' : ''}`}><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: x.c }} />{L.region(x.id)}{done.includes(x.id) ? ' ✓' : ''}</button></li>)}</ul></div>
    <div className="card"><h2 className="font-display text-xl font-bold">{L.region(r.id)}</h2><p className="mb-3 text-sm text-muted">{t('Spoken mainly in: {note}', { note: L.regionNote(r.id) })}</p>
     {list.length === 0 && <p className="text-sm">{t('No words yet. Be the first to contribute!')}</p>}
     <div className="space-y-3">{list.map(e => <div key={e.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface2 p-3"><Phrase e={e} /><Play t={e.kn} src={e.audio} /></div>)}</div></div>
   </div></div>
 )
}
