'use client'
import Link from 'next/link'
import { Volume2, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { speak } from '@/lib/data'
const label = (s: string) => s.replace(/:\s*$/, '')
export default function FeaturedWord() {
  const { t, kn } = useI18n()
  return (
    <section className="flex min-w-0 flex-col rounded-2xl bg-surface2 p-4 shadow-card sm:p-5">
      <h2 className="font-display text-xl font-bold text-maroon dark:text-gold">{t('Featured Word')}</h2>
      <div className="mt-3 flex flex-1 flex-col rounded-xl bg-surface p-4">
        <div className="flex items-center gap-3">
          <span className="font-kn text-4xl font-bold text-maroon dark:text-gold">ಉಪ್ಪು</span>
          <button aria-label={t('Play audio')} onClick={() => speak('ಉಪ್ಪು')} className="grid h-10 w-10 place-items-center rounded-full bg-maroon text-white"><Volume2 size={18} /></button>
        </div>
        {!kn && <p className="text-sm text-muted">(Uppu)</p>}
        <dl className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-surface2 px-3 py-2"><dt className="text-xs text-muted">{label(t('Meaning: '))}</dt><dd className="text-sm font-semibold">{t('Salt')}</dd></div>
          <div className="rounded-lg bg-surface2 px-3 py-2"><dt className="text-xs text-muted">{label(t('Region: '))}</dt><dd className="text-sm font-semibold">{t('Coastal Karnataka')}</dd></div>
        </dl>
        <div className="mt-3 rounded-lg border-l-4 border-primary bg-surface2 px-3 py-2">
          <p className="flex items-start justify-between gap-2 font-kn text-sm">“ಉಪ್ಪು ಹಾಕು ರುಚಿ ನೋಡು.”<button aria-label={t('Play audio')} onClick={() => speak('ಉಪ್ಪು ಹಾಕು ರುಚಿ ನೋಡು.')} className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-maroon text-white"><Volume2 size={14} /></button></p>
          <p className="text-xs text-muted">({t('Add salt and taste it.')})</p>
        </div>
        <div className="mt-auto pt-4"><Link href="/search" className="btn2 !py-1.5 text-xs">{t('Learn more')} <ArrowRight size={14} /></Link></div>
      </div>
    </section>
  )
}
