'use client'
import { motion } from 'framer-motion'
import { Search, Volume2, User } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { useUser } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import { WOTD, todayIndex } from '@/lib/wotd'
import { speak } from '@/lib/data'
import { useEffect, useState } from 'react'

export default function Hero() {
  const u = useUser(); const L = useI18n(); const { t, kn } = L
  const [wi, setWi] = useState(0); useEffect(() => setWi(todayIndex()), [])
  const [wk, wr, we, wm] = WOTD[wi]
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffe9a8] to-page dark:from-[#3a1410] lg:min-h-[340px]">
      {/* Top bar: in normal flow on phones/tablets (so it never covers the heading), floats top-right on wide screens */}
      <div className="relative z-20 flex items-center justify-end gap-2 px-4 pt-4 sm:gap-3 sm:px-6 lg:absolute lg:right-5 lg:top-5 lg:p-0">
        <ThemeToggle />
        <Link href="/profile" className="flex max-w-[11rem] items-center gap-2 rounded-lg bg-maroon px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-maroon2">
          <User size={16} className="shrink-0" />
          <span className="truncate">{u ? L.nm(u.name).split(' ')[0] : t('Profile')}</span>
        </Link>
      </div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-xl px-4 pb-2 pt-4 sm:px-8 sm:pt-6 lg:p-10">
        <h1 className="font-display text-4xl font-extrabold leading-[1.08] text-maroon dark:text-gold sm:text-5xl">
          {t('Different regions.')}<br />{t('Same heart.')} {t('One Kannada.')}
        </h1>
        <p className="mt-4 max-w-sm text-base text-muted sm:mt-5 sm:text-lg">{t('Explore, hear, compare and keep the rich regional dialects of Kannada alive.')}</p>
        <label className="mt-5 flex w-full max-w-[22rem] items-center gap-2 rounded-full bg-surface p-1.5 pl-4 shadow-card sm:mt-6">
          <Search size={16} className="shrink-0 text-muted" />
          <input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" placeholder={t('Search words, phrases, regions...')} aria-label={t('Search')} />
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-onprimary shadow-glow"><Search size={18} /></span>
        </label>
      </motion.div>
      {/* Mysore Palace: sits UNDER the text on phones/tablets, behind-right on wide screens. Transparent cutout, works in light + dark. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/palace.png"
        alt=""
        aria-hidden
        className="pointer-events-none relative z-0 mx-auto mt-3 block w-[92%] max-w-md select-none object-contain object-bottom sm:max-w-lg lg:absolute lg:bottom-0 lg:right-2 lg:mx-0 lg:mt-0 lg:w-[58%] lg:max-w-[820px]"
      />
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4 }}
        className="absolute right-[30%] top-8 z-10 hidden rounded-2xl bg-primary px-5 py-3 text-onprimary shadow-glow lg:block">
        <div className="text-xs">{t('Word of the Day')}</div>
        <div className="flex items-center gap-3">
          <div><div className="font-kn text-2xl font-bold text-maroon">{wk}</div><div className="text-xs">{kn ? wm : `(${wr}) · ${we}`}</div></div>
          <button aria-label={t('Play audio')} onClick={() => speak(wk)} className="grid h-10 w-10 place-items-center rounded-full bg-maroon text-white"><Volume2 size={18} /></button>
        </div>
      </motion.div>
    </section>
  )
}
