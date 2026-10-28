'use client'
import { useEffect, useState } from 'react'
import { ChevronRight, MapPin } from 'lucide-react'
import { REGIONS } from '@/lib/data'
import { useUser } from '@/lib/auth'
import RegionMap from './RegionMap'
export default function RegionExplorer() {
  const u = useUser(); const [sel, setSel] = useState('mysuru')
  useEffect(() => { if (u && REGIONS.some(r => r.id === u.region)) setSel(u.region) }, [u?.region])
  const cur = REGIONS.find(r => r.id === sel) ?? REGIONS[0]
  return (
    <section className="rounded-2xl bg-surface p-5 shadow-card">
      <h2 className="font-display text-2xl font-bold text-maroon dark:text-gold">Explore by Region</h2>
      <p className="text-xs text-muted">{u ? 'Your dialect area is glowing. Tap any region to explore it.' : 'Click on a region to discover its unique words, phrases, audio and culture.'}</p>
      <div className="mt-3 grid grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(240px,300px)_1fr]">
        <RegionMap sel={sel} onPick={setSel} className="mx-auto h-72 w-full sm:h-auto sm:max-h-[26rem]" />
        <ul className="space-y-2">
          {REGIONS.map(r => (
            <li key={r.id}>
              <button onClick={() => setSel(r.id)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${sel === r.id ? 'bg-primary font-semibold text-onprimary' : 'bg-surface2'}`}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.c }} />
                <span className="flex-1">{r.n}{u?.region === r.id && <span className="ml-2 rounded-full bg-maroon px-2 py-0.5 text-[10px] font-semibold text-white">You</span>}</span><ChevronRight size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><MapPin size={13} />{cur.n}: {cur.note}</p>
    </section>
  )
}
