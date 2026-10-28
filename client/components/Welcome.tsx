'use client'
import { LogOut, MapPin, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { useUser, logout, findRegion } from '@/lib/auth'
import { LangToggle } from './ui'

export default function Welcome() {
  const u = useUser(); const L = useI18n(); const { t } = L; if (!u) return null
  const r = findRegion(u.region, u.district)
  const regionName = r ? L.region(r.id) : t('Not selected')
  const district = u.district ? L.district(u.district) : t('Not selected')
  return (
    <div className="mx-5 mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card">
      <span className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ background: r?.c || '#8b1a1a' }}><MapPin size={20} /></span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-bold text-maroon dark:text-gold">{t('Namaskara, {name}!', { name: L.nm(u.name) })}</p>
        <p className="text-sm text-muted">
          {t('Your dialect: ')}<b className="text-ink">{regionName}</b>
          {t(', district: ')}<b className="text-ink">{district}</b>
          {t('. Both are highlighted on the map below.')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <LangToggle className="flex items-center gap-1.5 rounded-full border border-border bg-surface2 px-3 py-1.5 text-xs font-semibold hover:border-primary transition" />
        <Link href="/profile" className="flex items-center gap-1.5 rounded-full border border-border bg-surface2 px-3 py-1.5 text-xs font-semibold hover:border-primary transition"><UserIcon size={14} />{t('Profile')}</Link>
        <button onClick={logout} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-danger hover:text-danger transition"><LogOut size={14} />{t('Log out')}</button>
      </div>
    </div>
  )
}
