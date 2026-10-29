'use client'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { Map, Swords, Mic, Search, Plus, LayoutGrid } from 'lucide-react'
const mods = [['/map', 'Explore Karnataka Map', Map], ['/battle', 'Dialect Battle', Swords], ['/speak', 'Speak Like a Local', Mic], ['/detective', 'Dialect Detective', Search], ['/contribute', 'Contribute a Word', Plus], ['/about', 'More Modules', LayoutGrid]] as any[]
export default function ModuleCards() {
 const { t } = useI18n()
 return (
  <div className="grid min-w-0 grid-cols-1 content-start gap-3 min-[400px]:grid-cols-2 md:grid-cols-3">
   {mods.map(([h, l, Icon]) => (
    <Link key={l} href={h} className="flex items-center gap-3 rounded-xl border border-border bg-surface2 p-3 text-sm font-semibold leading-snug text-maroon shadow-card transition hover:shadow-glow dark:text-gold">
     <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-surface"><Icon size={22} strokeWidth={1.8} /></span>
     <span className="min-w-0 flex-1">{t(l)}</span>
    </Link>
   ))}
  </div>
 )
}
