'use client'
import Link from 'next/link'
import RegionMap from '@/components/RegionMap'
import { PageHead } from '@/components/ui'
import { REGIONS, useEntries } from '@/lib/data'
export default function Living() {
 const { all } = useEntries(); const cnt = (id: string) => all.filter(e => e.region === id).length; const low = [...REGIONS].sort((a, b) => cnt(a.id) - cnt(b.id))[0]
 return (
  <div className="p-5"><PageHead en="Living Language Map" kn="ಜೀವಂತ ನಕ್ಷೆ" sub="Darker saffron = more contributions." />
   <div className="grid gap-5 lg:grid-cols-2"><div className="card"><RegionMap heat /></div>
    <div className="card space-y-2"><h2 className="font-display text-lg font-bold">Contribution density</h2>
     {REGIONS.map(r => <div key={r.id} className="flex items-center gap-2 text-sm"><span className="w-40">{r.n}</span><div className="h-2 flex-1 rounded bg-surface2"><div className="h-2 rounded bg-[#e8830a]" style={{ width: Math.min(100, cnt(r.id) * 12) + '%' }} /></div><b>{cnt(r.id)}</b></div>)}
     <p className="pt-2 text-sm">🆘 Help needed in <b>{low.n}</b>.</p><Link className="btn" href="/contribute">Add contribution</Link></div></div></div>
 )
}
