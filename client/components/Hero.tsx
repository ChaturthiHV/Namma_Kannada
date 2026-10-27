'use client'
import { motion } from 'framer-motion'
import { Search, Volume2, User } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { useUser } from '@/lib/auth'

export default function Hero() {
  const u = useUser()
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffe9a8] to-page min-h-[340px] dark:from-[#3a1410]">
      <div className="absolute right-[18%] top-10 h-44 w-44 rounded-full bg-gold/60 blur-sm" />
      <svg className="absolute bottom-0 right-0 w-[60%] h-[75%]" viewBox="0 0 600 260" preserveAspectRatio="xMaxYMax slice" aria-hidden>
        <path d="M0 200 Q120 90 240 170 T480 130 T600 160 V260 H0Z" fill="#6b9a4a" opacity=".75" />
        <path d="M0 230 Q150 170 300 215 T600 200 V260 H0Z" fill="#3f7a3a" />
        <path d="M120 215 L170 110 L220 215Z" fill="#a0562a" stroke="#6b3418" strokeWidth="3" />
        <path d="M330 220 Q360 190 390 220Z" fill="#c0392b" />
        <path d="M0 250 Q200 225 420 250 T600 240 V260 H0Z" fill="#c8202a" />
      </svg>
      <div className="absolute right-5 top-5 flex items-center gap-3">
        <ThemeToggle />
        <Link href="/profile" className="flex items-center gap-2 rounded-lg bg-maroon px-4 py-2 text-sm font-semibold text-white shadow-card hover:bg-maroon2 transition">
          <User size={16} />
          <span>{u ? u.name.split(' ')[0] : 'Profile'}</span>
        </Link>
      </div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative p-10 max-w-xl">
        <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-maroon dark:text-gold">
          Different regions.<br />Same heart. One Kannada.
        </h1>
        <p className="mt-5 text-lg text-muted max-w-sm">Explore, hear, compare and keep the rich regional dialects of Kannada alive.</p>
        <label className="mt-6 flex items-center gap-2 rounded-full bg-surface p-1.5 pl-4 shadow-card max-w-md">
          <Search size={16} className="text-muted" />
          <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted" placeholder="Search words, phrases, regions..." />
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-onprimary shadow-glow"><Search size={18} /></span>
        </label>
      </motion.div>
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4 }}
        className="absolute right-[30%] top-8 hidden lg:block rounded-2xl bg-primary px-5 py-3 text-onprimary shadow-glow">
        <div className="text-xs">Word of the Day</div>
        <div className="flex items-center gap-3">
          <div><div className="font-kn text-2xl font-bold text-maroon">ಮಲೆನಾಡು</div><div className="text-xs">(Malenaadu)</div></div>
          <button aria-label="Play audio" className="grid h-10 w-10 place-items-center rounded-full bg-maroon text-white"><Volume2 size={18} /></button>
        </div>
      </motion.div>
    </section>
  )
}
