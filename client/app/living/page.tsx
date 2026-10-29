'use client'
import Link from 'next/link'
import RegionMap from '@/components/RegionMap'
import { PageHead } from '@/components/ui'
import { REGIONS, useEntries } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
export default function Living() {
 const L = useI18n(); const { t } = L; const { all } = useEntries(); const cnt = (id: string) => all.filter(e => e.region === id).length; const low = [...REGIONS].sort((a, b) => cnt(a.id) - cnt(b.id))[0]
 return (
  <div className="p-4 sm:p-5"><PageHead en="Living Language Map" kn="ಜೀವಂತ ನಕ್ಷೆ" sub={t('Darker saffron = more contributions.')} />
   <div className="grid gap-5 lg:grid-cols-2"><div className="card"><RegionMap heat /></div>
    <div className="card space-y-2"><h2 className="font-display text-lg font-bold">{t('Contribution density')}</h2>
     {REGIONS.map(r => <div key={r.id} className="flex items-center gap-2 text-sm"><span className="w-28 shrink-0 text-xs sm:w-40 sm:text-sm">{L.region(r.id)}</span><div className="h-2 min-w-0 flex-1 rounded bg-surface2"><div className="h-2 rounded bg-[#e8830a]" style={{ width: Math.min(100, cnt(r.id) * 12) + '%' }} /></div><b className="w-6 shrink-0 text-right">{cnt(r.id)}</b></div>)}
     <p className="pt-2 text-sm">🆘 {t('Help needed in {name}.', { name: '\u0001' }).split('\u0001').map((x, i) => i === 0 ? <span key="a">{x}<b>{L.region(low.id)}</b></span> : x)}</p><Link className="btn" href="/contribute">{t('Add contribution')}</Link></div></div></div>
 )
}
