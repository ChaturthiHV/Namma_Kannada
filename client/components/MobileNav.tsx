'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Home, MapPin, Mic, Search, Grid2x2, X, LogOut } from 'lucide-react'
import { NAV, PROFILE } from './Sidebar'
import { useUser, logout } from '@/lib/auth'
import { useLS } from '@/lib/data'
const TABS = [['/', 'Home', Home], ['/map', 'Map', MapPin], ['/detective', 'Play', Search]] as any[]
export default function MobileNav() {
 const p = usePathname(); const [open, setOpen] = useState(false); const [l] = useLS('lang', 'en'); const u = useUser()
 const PI = PROFILE[3]
 const tab = (h: string, n: string, I: any) => <Link key={h} href={h} aria-current={p === h ? 'page' : undefined} className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${p === h ? 'font-bold text-gold' : 'text-white/75'}`}><I size={22} />{n}</Link>
 return (
  <>
   {open && <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}><div className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto rounded-t-3xl bg-page p-4 pb-24 shadow-card" onClick={e => e.stopPropagation()} role="dialog" aria-label="All features">
    <div className="mb-3 flex items-center justify-between"><b className="font-display text-lg text-maroon dark:text-gold">All features</b><button aria-label="Close" onClick={() => setOpen(false)}><X /></button></div>
    <div className="grid grid-cols-3 gap-3">{NAV.map(([h, en, kn, I]: any) => <Link key={h} href={h} onClick={() => setOpen(false)} className="card flex flex-col items-center gap-1 !p-3 text-center text-xs"><I size={22} className="text-maroon dark:text-gold" />{l === 'kn' ? kn : en}</Link>)}</div>
    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
     <Link href={PROFILE[0]} onClick={() => setOpen(false)} className="card flex items-center justify-center gap-2 !p-3 text-xs font-semibold"><PI size={18} className="text-maroon dark:text-gold" />{l === 'kn' ? PROFILE[2] : PROFILE[1]}</Link>
     {u && <button onClick={() => { setOpen(false); logout() }} className="card flex items-center justify-center gap-2 !p-3 text-xs font-semibold"><LogOut size={18} className="text-maroon dark:text-gold" />{l === 'kn' ? 'ಲಾಗ್ ಔಟ್' : 'Log out'}</button>}
    </div></div></div>}
   <nav className="safe-b fixed inset-x-0 bottom-0 z-50 flex items-end bg-maroon px-1 text-white shadow-[0_-4px_20px_rgba(0,0,0,.25)] md:hidden" aria-label="Mobile">
    {tab(...(TABS[0] as [string, string, any]))}{tab(...(TABS[1] as [string, string, any]))}
    <Link href="/speak" aria-label="Speak Like a Local" className="mx-1 -mt-6 grid h-16 w-16 shrink-0 place-items-center rounded-full bg-primary text-onprimary shadow-glow ring-4 ring-maroon active:scale-95"><Mic size={28} /></Link>
    {tab(...(TABS[2] as [string, string, any]))}
    <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] text-white/75"><Grid2x2 size={22} />More</button>
   </nav>
  </>
 )
}
