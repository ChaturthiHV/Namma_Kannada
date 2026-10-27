'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, Swords, Mic, Search, PlusSquare, ShieldCheck, Sparkles, BookMarked, Stamp, MessagesSquare, Users, Flame, BookOpen, Info } from 'lucide-react'
import { useLS } from '@/lib/data'
export const NAV = [
 ['/', 'Home', 'ಮುಖಪುಟ', Home], ['/map', 'Explore Karnataka Map', 'ನಕ್ಷೆ', MapPin], ['/battle', 'Dialect Battle', 'ಉಪಭಾಷೆ ಸ್ಪರ್ಧೆ', Swords],
 ['/speak', 'Speak Like a Local', 'ಸ್ಥಳೀಯರಂತೆ ಮಾತು', Mic], ['/detective', 'Dialect Detective', 'ಉಪಭಾಷೆ ಪತ್ತೇದಾರ', Search], ['/contribute', 'Contribute a Word', 'ಪದ ಕೊಡುಗೆ', PlusSquare],
 ['/admin', 'Admin Verification', 'ಪರಿಶೀಲನೆ', ShieldCheck], ['/search', 'Smart Search', 'ಹುಡುಕಾಟ', Sparkles], ['/stories', 'Stories Behind Words', 'ಪದದ ಕಥೆ', BookMarked],
 ['/passport', 'Dialect Passport', 'ಪಾಸ್‌ಪೋರ್ಟ್', Stamp], ['/talk', 'Talk to a Local', 'ಸ್ಥಳೀಯರೊಂದಿಗೆ ಮಾತು', MessagesSquare], ['/voices', 'Voice Gallery', 'ಧ್ವನಿ ಗ್ಯಾಲರಿ', Users],
 ['/living', 'Living Language Map', 'ಜೀವಂತ ನಕ್ಷೆ', Flame], ['/journey', 'Learning Journey', 'ಕಲಿಕೆಯ ಪಯಣ', BookOpen], ['/about', 'About', 'ಬಗ್ಗೆ', Info],
] as any[]
export default function Sidebar() {
 const p = usePathname(); const [l] = useLS('lang', 'en')
 return (
  <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-gradient-to-b from-maroon to-maroon2 text-white md:flex">
   <div className="p-5"><div className="font-display text-2xl leading-none text-gold">Namma</div><div className="font-display text-4xl font-extrabold leading-none text-gold">Kannada</div><p className="mt-1 text-[9px] text-white/70">Different regions. Same heart. One Kannada.</p></div>
   <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
    {NAV.map(([h, en, kn, Icon]) => (
     <Link key={h} href={h} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${p === h ? 'bg-primary font-semibold text-onprimary shadow-glow' : 'text-white/85 hover:bg-white/10'}`}><Icon size={17} />{l === 'kn' ? kn : en}</Link>
    ))}
   </nav>
  </aside>
 )
}
