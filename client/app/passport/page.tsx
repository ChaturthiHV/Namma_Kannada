'use client'
import { PageHead } from '@/components/ui'
import { REGIONS, useLS } from '@/lib/data'
import { Lock } from 'lucide-react'
export default function Passport() {
 const [done] = useLS<string[]>('explored', []); const pct = Math.round(100 * done.length / REGIONS.length)
 return (
  <div className="p-5"><PageHead en="Dialect Passport" kn="ಪಾಸ್‌ಪೋರ್ಟ್" sub="Explore a region on the map or guess it right in Detective to earn its stamp." />
   <div className="card mb-5"><div className="mb-1 text-sm font-semibold">{done.length}/{REGIONS.length} unlocked</div><div className="h-3 overflow-hidden rounded-full bg-surface2"><div className="h-full bg-primary transition-all" style={{ width: pct + '%' }} /></div></div>
   <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{REGIONS.map(r => { const on = done.includes(r.id); return (
    <div key={r.id} className={`card grid place-items-center gap-2 text-center ${on ? '' : 'opacity-60 grayscale'}`}><div className="grid h-20 w-20 place-items-center rounded-full border-4 border-dashed font-display text-xl font-bold" style={{ borderColor: r.c, color: r.c, transform: on ? 'rotate(-8deg)' : 'none' }}>{on ? r.n[0] : <Lock size={22} />}</div><b className="text-sm">{r.n}</b><span className="text-xs text-muted">{on ? 'Stamped ✓' : 'Locked'}</span></div>) })}</div></div>
 )
}
