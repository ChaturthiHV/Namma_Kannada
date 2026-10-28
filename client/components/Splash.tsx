'use client'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function Splash({ onSkip }: { onSkip: () => void }) {
  const calm = useReducedMotion()
  // One staggered sequence: logo -> ನಮ್ಮ -> ಕನ್ನಡ -> line -> tagline. Each step overlaps the previous one so it reads as a single motion.
  const group: Variants = { show: { transition: { staggerChildren: calm ? 0 : 0.2, delayChildren: 0.15 } } }
  const rise: Variants = {
    hidden: calm ? { opacity: 1 } : { opacity: 0, y: 14, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
  }
  return (
    <motion.div
      role="status" aria-label="ನಮ್ಮ ಕರ್ನಾಟಕ" onClick={onSkip}
      initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] grid cursor-pointer place-items-center overflow-hidden bg-[#0d0608]"
    >
      {/* soft warm glow behind the lock-up, fades in first so the content appears to emerge from it */}
      <motion.div
        aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(255,194,26,.20), rgba(200,32,42,.09) 55%, transparent 75%)' }}
      />

      <motion.div variants={group} initial="hidden" animate="show" className="relative flex flex-col items-center px-6 text-center">
        <motion.img
          variants={rise} src="/logo.png" alt="ನಮ್ಮ ಕನ್ನಡ" draggable={false}
          className="h-[clamp(200px,30vh,280px)] w-auto select-none object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,.55)]"
        />

        <p className="mt-5 flex items-baseline justify-center gap-[0.35em] whitespace-nowrap font-display font-extrabold leading-none">
          <motion.span variants={rise} className="text-[clamp(1.7rem,6.5vw,2.6rem)] text-[#ffc21a]">ನಮ್ಮ</motion.span>
          <motion.span variants={rise} className="text-[clamp(2.4rem,10vw,4rem)] text-[#e8232b]">ಕನ್ನಡ</motion.span>
        </p>

        <motion.span
          aria-hidden variants={{ hidden: { scaleX: 0, opacity: 0 }, show: { scaleX: 1, opacity: 1, transition: { duration: 0.9, ease } } }}
          className="mt-5 block h-px w-24 origin-center bg-gradient-to-r from-transparent via-[#ffc21a] to-transparent"
        />
        <motion.p variants={rise} className="mt-3 text-[11px] text-white/60 sm:text-xs">ಬೇರೆ ಬೇರೆ ಪ್ರದೇಶ · ಒಂದೇ ಹೃದಯ · ಒಂದೇ ಕನ್ನಡ</motion.p>
      </motion.div>
    </motion.div>
  )
}
