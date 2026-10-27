'use client'
import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useLS, speak } from '@/lib/data'
export function PageHead({ en, kn, sub }: any) {
 const [l, setL] = useLS('lang', 'en')
 return (
  <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
   <div><h1 className="font-display text-3xl font-extrabold text-maroon dark:text-gold">{l === 'kn' ? kn : en}</h1>{sub && <p className="text-sm text-muted">{sub}</p>}</div>
   <div className="flex items-center gap-2"><button className="btn2" onClick={() => setL(l === 'en' ? 'kn' : 'en')}>{l === 'en' ? 'ಕನ್ನಡ' : 'EN'}</button><ThemeToggle /></div>
  </header>
 )
}
export const Wave = ({ on = false, n = 22 }: any) => (
 <div className="flex h-8 items-center gap-0.5" aria-hidden>
  {Array.from({ length: n }, (_, i) => <motion.i key={i} className="w-1 rounded bg-maroon/70 dark:bg-gold/80" animate={{ height: on ? [6, 8 + ((i * 7) % 22), 6] : 6 + ((i * 5) % 16) }} transition={{ repeat: on ? Infinity : 0, duration: .6 + (i % 4) * .1 }} />)}
 </div>
)
export const Play = ({ t, label = 'Play audio' }: any) => <button aria-label={label} onClick={() => speak(t)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-maroon text-white"><Volume2 size={18} /></button>
export const Badge = ({ s }: any) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s === 'verified' ? 'bg-green-600/20 text-green-700 dark:text-green-400' : s === 'pending' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-red-500/20 text-red-700 dark:text-red-400'}`}>{s === 'verified' ? '✓ Verified' : s[0].toUpperCase() + s.slice(1)}</span>
export const Ring = ({ v }: any) => (
 <div className="relative h-28 w-28"><svg viewBox="0 0 36 36" className="-rotate-90"><circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="3" /><circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f9d5a" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${v} 100`} /></svg><span className="absolute inset-0 grid place-items-center text-xl font-bold">{v}%</span></div>
)
export const Mascot = ({ mood = '🙂', children }: any) => <div className="flex items-center gap-3"><span className="text-4xl" aria-hidden>{mood}</span><p className="rounded-2xl rounded-bl-none bg-surface2 px-3 py-2 text-sm">{children}</p></div>
export const Phrase = ({ e }: any) => <div><div className="font-kn text-2xl font-bold">{e.kn}</div><div className="text-sm">{e.rom}</div><div className="text-xs text-muted">{e.en}</div></div>
