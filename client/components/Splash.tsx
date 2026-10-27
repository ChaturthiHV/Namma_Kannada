'use client'
import { motion, useReducedMotion } from 'framer-motion'

export default function Splash({ onSkip }: { onSkip: () => void }) {
  const calm = useReducedMotion()
  return (
    <motion.div
      role="status" aria-label="Namma Karnataka" onClick={onSkip}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-[#0d0608]"
    >
      <div aria-hidden className="absolute left-1/2 top-[42%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(255,194,26,.22), rgba(200,32,42,.10) 55%, transparent 75%)' }} />
      <div className="absolute inset-0 grid place-items-center pb-24">
        <motion.img
          src="/logo.png" alt="Namma Karnataka logo" draggable={false}
          initial={calm ? false : { opacity: 0, scale: 0.9, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="h-auto max-h-[62vh] w-[min(72vw,440px)] select-none object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,.6)]"
        />
      </div>
      <motion.p
        initial={calm ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 right-0 flex items-baseline gap-3 whitespace-nowrap px-6 font-display font-extrabold leading-none"
        style={{ paddingBottom: 'max(1.75rem, env(safe-area-inset-bottom))', paddingRight: 'max(1.5rem, env(safe-area-inset-right))' }}
      >
        <span className="text-[clamp(1.6rem,6vw,3rem)] text-[#ffc21a]">ನಮ್ಮ</span>
        <span className="text-[clamp(2.2rem,9vw,4.6rem)] text-[#e8232b]">ಕನ್ನಡ</span>
      </motion.p>
    </motion.div>
  )
}
