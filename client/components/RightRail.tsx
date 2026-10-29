'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
// "Keep Kannada Alive" call to action. Sits beside the shortcut tiles on wide screens, last on small ones.
export default function RightRail() {
  const { t } = useI18n()
  return (
    <aside className="order-last flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-br from-[#ffe08a] to-[#ffc21a] p-4 text-[#3a1218] sm:p-5 shadow-card xl:order-none">
      <div>
        <h2 className="font-display text-2xl font-bold leading-tight text-maroon">{t('Keep Kannada Alive')}</h2>
        <p className="mt-1.5 text-sm">{t('Contribute. Preserve. Be a part of the journey.')}</p>
      </div>
      <Link href="/contribute" className="inline-flex items-center gap-2 self-start rounded-lg bg-maroon px-4 py-2 text-xs font-semibold text-white">{t('Add a Word')} <ArrowRight size={14} /></Link>
    </aside>
  )
}
