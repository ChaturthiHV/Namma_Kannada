'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
export default function RightRail() {
  const { t, kn } = useI18n()
  return (
    <aside className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-[#ffe08a] to-[#ffc21a] p-5 shadow-card text-[#3a1218]">
        <h2 className="font-display text-3xl font-bold leading-tight text-maroon">{kn ? t('Keep Kannada Alive') : <>Keep<br />Kannada<br />Alive</>}</h2>
        <p className="mt-2 text-xs">{t('Contribute. Preserve. Be a part of the journey.')}</p>
        <Link href="/contribute" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-maroon px-4 py-2 text-xs font-semibold text-white">{t('Add a Word')} <ArrowRight size={14} /></Link>
      </div>
    </aside>
  )
}
