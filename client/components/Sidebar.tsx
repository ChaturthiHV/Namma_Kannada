'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, Swords, Mic, Search, PlusSquare, Sparkles, MessagesSquare, Users, Flame, User, LogOut } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { LangToggle } from './ui'
import { useUser, logout } from '@/lib/auth'
export const NAV = [
    ['/', 'Home', 'ಮುಖಪುಟ', Home],
    ['/map', 'Explore Karnataka Map', 'ನಕ್ಷೆ', MapPin],
    ['/living', 'Living Language Map', 'ಜೀವಂತ ನಕ್ಷೆ', Flame],
    ['/voices', 'Voice Gallery', 'ಧ್ವನಿ ಗ್ಯಾಲರಿ', Users],
    ['/speak', 'Speak Like a Local', 'ಸ್ಥಳೀಯರಂತೆ ಮಾತು', Mic],
    ['/talk', 'Talk to a Local', 'ಸ್ಥಳೀಯರೊಂದಿಗೆ ಮಾತು', MessagesSquare],
    ['/search', 'Smart Search', 'ಹುಡುಕಾಟ', Sparkles],
    ['/battle', 'Dialect Battle', 'ಉಪಭಾಷೆ ಸ್ಪರ್ಧೆ', Swords],
    ['/detective', 'Dialect Detective', 'ಉಪಭಾಷೆ ಪತ್ತೇದಾರ', Search],

    ['/contribute', 'Contribute a Word', 'ಪದ ಕೊಡುಗೆ', PlusSquare],
] as any[]
export const PROFILE = ['/profile', 'Profile', 'ಪ್ರೊಫೈಲ್', User] as any[]
export default function Sidebar() {
    const p = usePathname(); const { kn, t } = useI18n(); const u = useUser(); const l = kn ? 'kn' : 'en'
    const [ph, pen, pkn, PIcon] = PROFILE
    return (
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-hidden bg-gradient-to-b from-maroon to-maroon2 text-white md:flex">
            <div className="px-5 pb-3 pt-4"><img src="/logo.png" alt={t('Namma Karnataka')} className="mb-2 h-14 w-14 object-contain [@media(max-height:760px)]:h-10 [@media(max-height:760px)]:w-10 drop-shadow-[0_6px_14px_rgba(0,0,0,.4)]" /><div className="font-display text-1xl leading-none text-gold">{kn ? 'ನಮ್ಮ' : 'Namma'}</div><div className="font-display text-3xl font-extrabold leading-none text-gold">{kn ? 'ಕನ್ನಡ' : 'Kannada'}</div><p className="mt-1 text-[9px] text-white/70">{t('Different regions. Same heart. One Kannada.')}</p></div>
            <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3">
                {NAV.map(([h, en, kn, Icon]) => (
                    <Link key={h} href={h} className={`flex items-center gap-3 rounded-lg px-3 py-[7px] text-sm transition ${p === h ? 'bg-primary font-semibold text-onprimary shadow-glow' : 'text-white/85 hover:bg-white/10'}`}><Icon size={17} />{l === 'kn' ? kn : en}</Link>
                ))}
            </nav>
            <div className="shrink-0 space-y-0.5 px-3 pb-4 pt-3"><div className="mb-3 border-t border-white/15" /><LangToggle className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-[7px] text-sm text-white/85 transition hover:bg-white/10" />
                <Link href={ph} className={`flex items-center gap-3 rounded-lg px-3 py-[7px] text-sm transition ${p === ph ? 'bg-primary font-semibold text-onprimary shadow-glow' : 'text-white/85 hover:bg-white/10'}`}><PIcon size={17} />{l === 'kn' ? pkn : pen}</Link>
                {u && <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/85 transition hover:bg-white/10"><LogOut size={17} />{t('Log out')}</button>}
            </div>
        </aside>
    )
}