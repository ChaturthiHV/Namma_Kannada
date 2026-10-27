import { BookMarked } from 'lucide-react'
export default function Stories() {
  return (
    <section className="rounded-2xl bg-surface p-4 shadow-card">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="flex items-center gap-2"><BookMarked size={18} className="text-primary" />Stories Behind the Words</span>
        <a href="#" className="text-xs text-maroon dark:text-gold">View All →</a>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="h-28 rounded-xl bg-gradient-to-br from-[#c8202a] to-[#f08a24]" />
        <div className="h-28 rounded-xl bg-gradient-to-br from-[#f7c325] to-[#e0452b]" />
        <blockquote className="grid place-items-center rounded-xl bg-surface2 p-3 font-kn text-sm">“ಹಳ್ಳಿಯ ಮಾತು, ಹೃದಯದ ಮಾತು”</blockquote>
      </div>
    </section>
  )
}
