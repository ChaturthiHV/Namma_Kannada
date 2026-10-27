'use client'
import { LogOut, MapPin, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { REGIONS } from '@/lib/data'
import { useUser, logout } from '@/lib/auth'
export default function Welcome() {
  const u = useUser(); if (!u) return null
  const r = REGIONS.find(x => x.id === u.region)
  return (
    <div className="mx-5 mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card">
      <span className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ background: r?.c }}><MapPin size={20} /></span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-bold text-maroon dark:text-gold">ನಮಸ್ಕಾರ, {u.name}!</p>
        <p className="text-sm text-muted">Your dialect: <b className="text-ink">{r?.n}</b>, district: <b className="text-ink">{u.district}</b>. Both are highlighted on the map below.</p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/profile" className="flex items-center gap-1.5 rounded-full border border-border bg-surface2 px-3 py-1.5 text-xs font-semibold hover:border-primary transition"><UserIcon size={14} />Profile</Link>
        <button onClick={logout} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-danger hover:text-danger transition"><LogOut size={14} />Log out</button>
      </div>
    </div>
  )
}
