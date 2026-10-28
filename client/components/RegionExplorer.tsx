'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, MapPin } from 'lucide-react'
import { REGIONS } from '@/lib/data'
import { useUser } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import RegionMap from './RegionMap'
export default function RegionExplorer() {
  const L = useI18n(); const { t } = L; const u = useUser(); const [sel, setSel] = useState('mysuru')
  useEffect(() => { if (u && REGIONS.some(r => r.id === u.region)) setSel(u.region) }, [u?.region])
  const cur = REGIONS.find(r => r.id === sel) ?? REGIONS[0]
  return (
    <section className="flex min-w-0 flex-col rounded-2xl bg-surface p-5 shadow-card">
      <h2 className="font-display text-2xl font-bold text-maroon dark:text-gold">{t('Explore by Region')}</h2>
      <p className="text-xs text-muted">{u ? t('Your dialect area is glowing. Tap any region to explore it.') : t('Click on a region to discover its unique words, phrases, audio and culture.')}</p>
      <div className="mt-4 grid flex-1 gap-4 md:grid-cols-2">
        <div className="grid place-items-center rounded-xl bg-page p-3">
          <RegionMap sel={sel} onPick={setSel} className="h-72 w-full md:h-[22rem]" />
        </div>
        <ul className="flex flex-col gap-2">
          {REGIONS.map(r => (
            <li key={r.id} className="flex flex-1">
              <button onClick={() => setSel(r.id)} aria-pressed={sel === r.id} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${sel === r.id ? 'bg-primary font-semibold text-onprimary shadow-glow' : 'bg-surface2 hover:brightness-95'}`}>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.c }} />
                <span className="flex-1">{L.region(r.id)}{u?.region === r.id && <span className="ml-2 rounded-full bg-maroon px-2 py-0.5 text-[10px] font-semibold text-white">{t('You')}</span>}</span><ChevronRight size={14} className="shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface2 px-4 py-3">
        <p className="flex min-w-0 flex-1 basis-64 items-start gap-2 text-xs text-muted"><MapPin size={14} className="mt-0.5 shrink-0" /><span><b className="text-ink">{L.region(cur.id)}:</b> {L.regionNote(cur.id)}</span></p>
        <Link href="/map" className="btn2 shrink-0 !py-1.5 text-xs">{t('Explore Karnataka Map')}</Link>
      </div>
    </section>
  )
}
