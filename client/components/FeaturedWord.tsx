'use client'
import { Volume2, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { speak } from '@/lib/data'
export default function FeaturedWord() {
  const { t, kn } = useI18n()
  return (
    <section className="rounded-2xl bg-surface2 p-5 shadow-card">
      <h2 className="font-display text-xl font-bold text-maroon dark:text-gold">{t('Featured Word')}</h2>
      <div className="mt-3 rounded-xl bg-surface p-4">
        <div className="flex items-center gap-3">
          <span className="font-kn text-4xl font-bold text-maroon dark:text-gold">ಉಪ್ಪು</span>
          <button aria-label={t('Play audio')} onClick={() => speak('ಉಪ್ಪು')} className="grid h-10 w-10 place-items-center rounded-full bg-maroon text-white"><Volume2 size={18} /></button>
        </div>
        {!kn && <p className="text-sm text-muted">(Uppu)</p>}
        <dl className="mt-3 space-y-1 text-sm">
          <div><dt className="inline font-semibold">{t('Meaning: ')}</dt><dd className="inline">{t('Salt')}</dd></div>
          <div><dt className="inline font-semibold">{t('Region: ')}</dt><dd className="inline">{t('Coastal Karnataka')}</dd></div>
        </dl>
        <p className="mt-3 flex items-center gap-2 font-kn text-sm">“ಉಪ್ಪು ಹಾಕು ರುಚಿ ನೋಡು.”<button aria-label={t('Play audio')} onClick={() => speak('ಉಪ್ಪು ಹಾಕು ರುಚಿ ನೋಡು.')} className="grid h-7 w-7 place-items-center rounded-full bg-maroon text-white"><Volume2 size={14} /></button></p>
        <p className="text-xs text-muted">({t('Add salt and taste it.')})</p>
        <div className="mt-4 h-24 rounded-lg bg-gradient-to-b from-[#fde7a0] to-[#6fb7c4]" />
        <button className="mt-3 flex items-center gap-2 rounded-lg bg-maroon px-4 py-2 text-xs font-semibold text-white">{t('Learn more')} <ArrowRight size={14} /></button>
      </div>
    </section>
  )
}
