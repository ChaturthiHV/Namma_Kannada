import { ArrowRight } from 'lucide-react'
export default function RightRail() {
  return (
    <aside className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-[#ffe08a] to-[#ffc21a] p-5 shadow-card text-[#3a1218]">
        <h2 className="font-display text-3xl font-bold leading-tight text-maroon">Keep<br />Kannada<br />Alive</h2>
        <p className="mt-2 text-xs">Contribute. Preserve.<br />Be a part of the journey.</p>
        <button className="mt-3 flex items-center gap-2 rounded-lg bg-maroon px-4 py-2 text-xs font-semibold text-white">Add a Word <ArrowRight size={14} /></button>
      </div>
    </aside>
  )
}
