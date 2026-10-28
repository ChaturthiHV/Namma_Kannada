'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Volume2, VolumeX, Languages } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { speak } from '@/lib/data'
import { useI18n } from '@/lib/i18n'

export function LangToggle({ className = '' }: { className?: string }) {
 const { kn, setLang, t } = useI18n()
 return <button type="button" className={className || 'btn2'} aria-label={t('Switch language')} onClick={() => setLang(kn ? 'en' : 'kn')}><Languages size={14} />{kn ? 'English' : 'ಕನ್ನಡ'}</button>
}
export function PageHead({ en, kn, sub }: any) {
 const L = useI18n()
 return (
  <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
   <div><h1 className="font-display text-3xl font-extrabold text-maroon dark:text-gold">{L.kn ? (kn ?? L.t(en)) : en}</h1>{sub && <p className="text-sm text-muted">{sub}</p>}</div>
   <div className="flex items-center gap-2"><LangToggle /><ThemeToggle /></div>
  </header>
 )
}
export const Wave = ({ on = false, n = 22 }: any) => (
 <div className="flex h-8 items-center gap-0.5" aria-hidden>
  {Array.from({ length: n }, (_, i) => <motion.i key={i} className="w-1 rounded bg-maroon/70 dark:bg-gold/80" animate={{ height: on ? [6, 8 + ((i * 7) % 22), 6] : 6 + ((i * 5) % 16) }} transition={{ repeat: on ? Infinity : 0, duration: .6 + (i % 4) * .1 }} />)}
 </div>
)
export const Play = ({ t, label, src }: any) => { const L = useI18n(); const [bad, setBad] = useState(false); return <button aria-label={label ?? L.t('Play audio')} title={bad ? L.t('Audio could not be played. Check that your device is not muted, then try again.') : undefined} onClick={async () => { setBad(false); const ok = await speak(t, src); if (!ok) setBad(true) }} className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-white ${bad ? 'bg-red-600' : 'bg-maroon'}`}>{bad ? <VolumeX size={18} /> : <Volume2 size={18} />}</button> }
export const Badge = ({ s }: any) => { const { t } = useI18n(); return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s === 'verified' ? 'bg-green-600/20 text-green-700 dark:text-green-400' : s === 'pending' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-red-500/20 text-red-700 dark:text-red-400'}`}>{s === 'verified' ? '✓ ' + t('Verified') : t(s[0].toUpperCase() + s.slice(1))}</span> }
export const Ring = ({ v }: any) => (
 <div className="relative h-28 w-28"><svg viewBox="0 0 36 36" className="-rotate-90"><circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="3" /><circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f9d5a" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${v} 100`} /></svg><span className="absolute inset-0 grid place-items-center text-xl font-bold">{v}%</span></div>
)
export const Mascot = ({ mood = '🙂', children }: any) => <div className="flex items-center gap-3"><span className="text-4xl" aria-hidden>{mood}</span><p className="rounded-2xl rounded-bl-none bg-surface2 px-3 py-2 text-sm">{children}</p></div>
/** A dialect entry. Kannada mode: Kannada script + Kannada meaning only (the Latin romanisation is hidden). English mode: script, romanisation and English meaning. */
export const Phrase = ({ e }: any) => { const { kn, tr } = useI18n(); return <div><div className="font-kn text-2xl font-bold">{e.kn}</div>{!kn && e.rom && <div className="text-sm">{e.rom}</div>}<div className="text-xs text-muted">{kn ? tr(e.en) : e.en}</div></div> }
