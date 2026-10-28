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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffe9a8] to-page min-h-[340px] dark:from-[#3a1410]">
      {/* Mysore Palace (transparent cutout, works on light + dark themes) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/palace.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-2 w-[58%] max-w-[820px] select-none object-contain object-bottom drop-shadow-[0_6px_16px_rgba(122,26,26,0.35)] dark:drop-shadow-[0_0_22px_rgba(255,170,60,0.35)]"
      />
      <div className="absolute right-5 top-5 flex items-center gap-3">
        <ThemeToggle />
        <Link href="/profile" className="flex items-center gap-2 rounded-lg bg-maroon px-4 py-2 text-sm font-semibold text-white shadow-card hover:bg-maroon2 transition">
          <User size={16} />
          <span>{u ? L.nm(u.name).split(' ')[0] : t('Profile')}</span>
        </Link>
      </div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative p-10 max-w-xl">
        <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-maroon dark:text-gold">
          {t('Different regions.')}<br />{t('Same heart.')} {t('One Kannada.')}
        </h1>
        <p className="mt-5 text-lg text-muted max-w-sm">{t('Explore, hear, compare and keep the rich regional dialects of Kannada alive.')}</p>
        <label className="mt-6 flex items-center gap-2 rounded-full bg-surface p-1.5 pl-4 shadow-card max-w-md">
          <Search size={16} className="text-muted" />
          <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted" placeholder={t('Search words, phrases, regions...')} aria-label={t('Search')} />
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-onprimary shadow-glow"><Search size={18} /></span>
        </label>
      </motion.div>
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4 }}
        className="absolute right-[30%] top-8 hidden lg:block rounded-2xl bg-primary px-5 py-3 text-onprimary shadow-glow">
        <div className="text-xs">{t('Word of the Day')}</div>
        <div className="flex items-center gap-3">
          <div><div className="font-kn text-2xl font-bold text-maroon">{wk}</div><div className="text-xs">{kn ? wm : `(${wr}) · ${we}`}</div></div>
          <button aria-label={t('Play audio')} onClick={() => speak(wk)} className="grid h-10 w-10 place-items-center rounded-full bg-maroon text-white"><Volume2 size={18} /></button>
        </div>
      </motion.div>
    </section>
  )
}
