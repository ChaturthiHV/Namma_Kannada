import Link from 'next/link'
import { Map, Swords, Mic, Search, Plus, LayoutGrid, ArrowRight } from 'lucide-react'
const mods = [['/map', 'Explore Karnataka Map', Map], ['/battle', 'Dialect Battle', Swords], ['/speak', 'Speak Like a Local', Mic], ['/detective', 'Dialect Detective', Search], ['/contribute', 'Contribute a Word', Plus], ['/about', 'More Modules', LayoutGrid]] as any[]
export default function ModuleCards() {
 return (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
   {mods.map(([h, l, Icon]) => (
    <Link key={l} href={h} className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface2 p-4 text-center text-sm font-semibold text-maroon shadow-card transition hover:-translate-y-1 hover:shadow-glow dark:text-gold"><Icon size={34} strokeWidth={1.6} /><span>{l}</span><ArrowRight size={14} className="opacity-60 transition group-hover:translate-x-1" /></Link>
   ))}
  </div>
 )
}
