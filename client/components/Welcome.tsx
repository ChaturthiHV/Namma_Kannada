'use client'
import { LogOut, MapPin } from 'lucide-react'
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
      <button onClick={logout} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold"><LogOut size={14} />Log out</button>
    </div>
  )
}
