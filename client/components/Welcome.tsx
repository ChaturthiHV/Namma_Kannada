'use client'
import { Languages, LogOut, MapPin, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useLS } from '@/lib/data'
import { useUser, logout, findRegion } from '@/lib/auth'

// Kannada names for the six dialect areas and the districts (shown when the language is ಕನ್ನಡ)
const REGION_KN: Record<string, string> = {
  north: 'ಧಾರವಾಡ–ಉತ್ತರ ಕರ್ನಾಟಕ ಕನ್ನಡ',
  hk: 'ಕಲಬುರಗಿ–ಹೈದರಾಬಾದ್ ಕರ್ನಾಟಕ ಕನ್ನಡ',
  mysuru: 'ಮೈಸೂರು–ದಕ್ಷಿಣ ಕನ್ನಡ',
  bengaluru: 'ಬೆಂಗಳೂರು ಕನ್ನಡ',
  coastal: 'ಕರಾವಳಿ ಕನ್ನಡ',
  malnad: 'ಮಲೆನಾಡು ಕನ್ನಡ',
}
const DISTRICT_KN: Record<string, string> = {
  Belagavi: 'ಬೆಳಗಾವಿ', Bagalkot: 'ಬಾಗಲಕೋಟೆ', Vijayapura: 'ವಿಜಯಪುರ', Dharwad: 'ಧಾರವಾಡ', Gadag: 'ಗದಗ', Haveri: 'ಹಾವೇರಿ', Davanagere: 'ದಾವಣಗೆರೆ', Chitradurga: 'ಚಿತ್ರದುರ್ಗ',
  Kalaburagi: 'ಕಲಬುರಗಿ', Bidar: 'ಬೀದರ್', Yadgir: 'ಯಾದಗಿರಿ', Raichur: 'ರಾಯಚೂರು', Koppal: 'ಕೊಪ್ಪಳ', Ballari: 'ಬಳ್ಳಾರಿ', Vijayanagara: 'ವಿಜಯನಗರ',
  Mysuru: 'ಮೈಸೂರು', Mandya: 'ಮಂಡ್ಯ', Chamarajanagar: 'ಚಾಮರಾಜನಗರ', Hassan: 'ಹಾಸನ', Tumakuru: 'ತುಮಕೂರು', Ramanagara: 'ರಾಮನಗರ', Chikkaballapura: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ', Kolar: 'ಕೋಲಾರ',
  'Bengaluru Urban': 'ಬೆಂಗಳೂರು ನಗರ', 'Bengaluru Rural': 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ',
  'Dakshina Kannada': 'ದಕ್ಷಿಣ ಕನ್ನಡ', Udupi: 'ಉಡುಪಿ', 'Uttara Kannada': 'ಉತ್ತರ ಕನ್ನಡ',
  Shivamogga: 'ಶಿವಮೊಗ್ಗ', Chikkamagaluru: 'ಚಿಕ್ಕಮಗಳೂರು', Kodagu: 'ಕೊಡಗು',
}

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
