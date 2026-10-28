'use client'
import { Languages, LogOut, MapPin, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useLS } from '@/lib/data'
import { REGION_KN, DISTRICT_KN } from '@/lib/kn'
import { useUser, logout, findRegion } from '@/lib/auth'

export default function Welcome() {
  const u = useUser(); const [l, setL] = useLS('lang', 'en'); if (!u) return null
  const kn = l === 'kn'
  const r = findRegion(u.region, u.district)
  const regionName = r ? (kn ? REGION_KN[r.id] || r.n : r.n) : (kn ? 'ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ' : 'Not selected')
  const district = u.district ? (kn ? DISTRICT_KN[u.district] || u.district : u.district) : (kn ? 'ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ' : 'Not selected')
  return (
    <div className="mx-5 mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card">
      <span className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ background: r?.c || '#8b1a1a' }}><MapPin size={20} /></span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-bold text-maroon dark:text-gold">{kn ? 'ನಮಸ್ಕಾರ' : 'Namaskara'}, {u.name}!</p>
        <p className="text-sm text-muted">
          {kn ? 'ನಿಮ್ಮ ಉಪಭಾಷೆ: ' : 'Your dialect: '}<b className="text-ink">{regionName}</b>
          {kn ? ', ಜಿಲ್ಲೆ: ' : ', district: '}<b className="text-ink">{district}</b>
          {kn ? '. ಎರಡನ್ನೂ ಕೆಳಗಿನ ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಲಾಗಿದೆ.' : '. Both are highlighted on the map below.'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setL(kn ? 'en' : 'kn')} aria-label="Switch language" className="flex items-center gap-1.5 rounded-full border border-border bg-surface2 px-3 py-1.5 text-xs font-semibold hover:border-primary transition"><Languages size={14} />{kn ? 'English' : 'ಕನ್ನಡ'}</button>
        <Link href="/profile" className="flex items-center gap-1.5 rounded-full border border-border bg-surface2 px-3 py-1.5 text-xs font-semibold hover:border-primary transition"><UserIcon size={14} />{kn ? 'ಪ್ರೊಫೈಲ್' : 'Profile'}</Link>
        <button onClick={logout} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-danger hover:text-danger transition"><LogOut size={14} />{kn ? 'ಲಾಗ್ ಔಟ್' : 'Log out'}</button>
      </div>
    </div>
  )
}
