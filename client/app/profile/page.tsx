'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Check, Compass, LogOut, MapPin, Pencil, Phone, Star, Trophy, Lock } from 'lucide-react'
import { useUser, logout, updateProfile, DISTRICTS, findRegion } from '@/lib/auth'
import { REGIONS, useLS, useEntries, VOTES_NEEDED } from '@/lib/data'
import { useI18n, transliterate } from '@/lib/i18n'
import RegionMap from '@/components/RegionMap'
import { AuthScreen } from '@/components/AuthGate'
import { PageHead, Badge, Play } from '@/components/ui'

const fg = (h?: string) => { const n = parseInt((h || '#8e1015').slice(1), 16); const y = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)); return y > 150 ? '#3a1218' : '#fff' }

// Levels are earned with XP: 10 per word learned, 15 per region explored, plus game points.
const LEVELS: [number, string, string][] = [
 [0, 'Beginner', 'ಹೊಸಬ'], [60, 'Explorer', 'ಅನ್ವೇಷಕ'], [150, 'Speaker', 'ಮಾತುಗಾರ'], [300, 'Dialect Expert', 'ಉಪಭಾಷೆ ತಜ್ಞ'], [600, 'Kannada Champion', 'ಕನ್ನಡ ಚಾಂಪಿಯನ್'],
]

const Stat = ({ icon: I, l, v, tint }: any) => (
 <div className="card flex items-center gap-3 !p-4">
  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: tint + '26', color: tint }}><I size={22} /></span>
  <div><div className="text-2xl font-bold leading-none text-ink">{v}</div><div className="mt-1 text-xs text-muted">{l}</div></div>
 </div>
)

export default function ProfilePage() {
 const u = useUser()
 const { all } = useEntries()
 const [ready, setReady] = useState(false)
 const [editing, setEditing] = useState(false)
 const [f, setF] = useState({ name: '', region: '', district: '' })
 const [saving, setSaving] = useState(false)
 const [msg, setMsg] = useState<{ text: string; err: boolean } | null>(null)
 const [learned] = useLS<string[]>('learned', [])
 const [explored] = useLS<string[]>('explored', [])
 const [points] = useLS<number>('points', 0)
 const [best] = useLS<number>('best', 0)
 const L = useI18n(); const kn = L.kn
 // t(en, kn?): the explicit Kannada wins when given; otherwise the central dictionary / translation API is used.
 const t = (en: string, k?: string) => (kn && k ? k : L.t(en))

 // useUser starts as null until the session is read; wait so logged-in users don't flash the login form
 useEffect(() => { setReady(true) }, [])

 const r = u ? findRegion(u.region, u.district) : undefined
 const startEdit = () => { if (!u) return; setF({ name: u.name, region: r?.id || '', district: u.district || '' }); setMsg(null); setEditing(true) }
 const save = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!f.name.trim()) return setMsg({ text: 'Please enter your name.', err: true })
  if (!f.region) return setMsg({ text: 'Please choose your Kannada.', err: true })
  if (!f.district) return setMsg({ text: 'Please select your district.', err: true })
  setSaving(true); setMsg(null)
  // Only send region/district when they actually changed to avoid triggering server-side validation unnecessarily
  const payload: { name: string; region?: string; district?: string } = { name: f.name.trim() }
  const curRegion = r?.id || ''
  if (f.region !== curRegion || f.district !== (u?.district || '')) {
   payload.region = f.region
   payload.district = f.district
  }
  const err = await updateProfile(payload)
  setSaving(false)
  if (err) setMsg({ text: err, err: true })
  else { setMsg({ text: 'Profile updated.', err: false }); setEditing(false) }
 }

 if (!ready) return <div className="p-5"><PageHead en="My Profile" kn="ನನ್ನ ಪ್ರೊಫೈಲ್" /></div>
 if (!u) return (
  <div className="p-5"><PageHead en="My Profile" kn="ನನ್ನ ಪ್ರೊಫೈಲ್" sub={t('Log in or create an account to save your progress and light up your home on the map.', 'ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಉಳಿಸಲು ಲಾಗ್ ಇನ್ ಆಗಿ ಅಥವಾ ಖಾತೆ ರಚಿಸಿ.')} />
   <div className="card max-w-md"><AuthScreen compact /></div></div>
 )

 const n = (a: any) => (Array.isArray(a) ? a.length : 0)
 const words = n(learned), regions = n(explored)
 const mine = all.filter((e: any) => e.mine || (e.by && e.by === u.phone))
 const xp = words * 10 + regions * 15 + (points || 0)
 let li = 0; LEVELS.forEach(([min], i) => { if (xp >= min) li = i })
 const next = LEVELS[li + 1]
 const pct = next ? Math.round(((xp - LEVELS[li][0]) / (next[0] - LEVELS[li][0])) * 100) : 100
 const rName = r ? L.region(r.id) : t('Not selected', 'ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ')
 const dName = (d: string) => L.district(d)
 const uname = L.nm(u.name)
 const initial = (uname?.trim()[0] || 'K').toUpperCase()
 const accent = r?.c || '#8e1015'
 const myWords = r ? all.filter((e: any) => e.region === r.id && e.status === 'verified').slice(0, 4) : []


 return (
  <div className="p-5"><PageHead en="My Profile" kn="ನನ್ನ ಪ್ರೊಫೈಲ್" sub={t('Your Kannada, your district, your progress.', 'ನಿಮ್ಮ ಕನ್ನಡ, ನಿಮ್ಮ ಜಿಲ್ಲೆ, ನಿಮ್ಮ ಪ್ರಗತಿ.')} />

   {/* Header card */}
   <div className="card relative mb-5 overflow-hidden !p-0">
    <div className="h-24 w-full" style={{ background: `linear-gradient(120deg, ${accent}, ${accent}99 55%, #ffc21a)` }} />
    <div className="flex flex-wrap items-end gap-4 px-5 pb-5">
     <div className="-mt-10 grid h-20 w-20 shrink-0 place-items-center rounded-full border-4 border-surface text-3xl font-bold shadow-card" style={{ background: accent, color: fg(accent) }}>{initial}</div>
     <div className="min-w-0 flex-1 pt-3">
      <h2 className="truncate font-display text-2xl font-bold">{uname}</h2>
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
       {u.phone && <span className="flex items-center gap-1"><Phone size={13} />{u.phone}</span>}
       {u.district && <span className="flex items-center gap-1"><MapPin size={13} />{dName(u.district)}</span>}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
       <span className="chip flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />{rName}</span>
       <span className="chip flex items-center gap-1.5 font-semibold"><Trophy size={12} />{kn ? LEVELS[li][2] : LEVELS[li][1]}</span>
      </div>
     </div>
     <div className="flex gap-2">
      <button className="btn2" onClick={() => (editing ? setEditing(false) : startEdit())}><Pencil size={14} />{editing ? t('Cancel', 'ರದ್ದು') : t('Edit profile', 'ಎಡಿಟ್')}</button>
      <button className="btn2 !bg-danger" onClick={logout}><LogOut size={14} />{t('Log out', 'ಲಾಗ್ ಔಟ್')}</button>
     </div>
    </div>
   </div>

   {msg && <p role="status" className={`mb-5 rounded-lg px-3 py-2 text-sm ${msg.err ? 'bg-danger/15 text-red-700 dark:text-red-300' : 'bg-green-600/15 text-green-700 dark:text-green-400'}`}>{L.t(msg.text)}</p>}

   {!r && !editing && (
    <div className="card mb-5 flex flex-wrap items-center justify-between gap-3 border-primary/60">
     <p className="text-sm">{t('Your dialect isn’t set yet. Choose the Kannada you speak to see your region on the map and to vote on words from your dialect.', 'ನಿಮ್ಮ ಉಪಭಾಷೆಯನ್ನು ಇನ್ನೂ ಆರಿಸಿಲ್ಲ. ನೀವು ಮಾತನಾಡುವ ಕನ್ನಡವನ್ನು ಆರಿಸಿ.')}</p>
     <button className="btn" onClick={startEdit}>{t('Choose my dialect', 'ನನ್ನ ಉಪಭಾಷೆ ಆರಿಸಿ')}</button>
    </div>
   )}

   {editing && (
    <form onSubmit={save} className="card mb-5 max-w-2xl space-y-3">
     <h2 className="font-display text-lg font-bold">{t('Edit your details', 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಎಡಿಟ್ ಮಾಡಿ')}</h2>
     <input className="inp" placeholder={t('Full name', 'ಪೂರ್ಣ ಹೆಸರು')} aria-label={t('Full name', 'ಪೂರ್ಣ ಹೆಸರು')} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} onBlur={async () => { if (kn && f.name.trim()) { const v = await transliterate(f.name.trim()); setF(p => ({ ...p, name: v })) } }} />
     <div><div className="mb-2 text-xs font-semibold text-muted">{t('Which Kannada do you speak?', 'ನೀವು ಯಾವ ಕನ್ನಡ ಮಾತನಾಡುತ್ತೀರಿ?')}</div>
      <div className="flex flex-wrap gap-2">{REGIONS.map(x => <button type="button" key={x.id} aria-pressed={f.region === x.id} onClick={() => setF({ ...f, region: x.id, district: '' })} className={`chip flex items-center gap-2 ${f.region === x.id ? 'on' : ''}`}><i className="h-2.5 w-2.5 rounded-full" style={{ background: x.c }} />{L.region(x.id)}</button>)}</div></div>
     <select className="inp" aria-label={t('District', 'ಜಿಲ್ಲೆ')} value={f.district} disabled={!f.region} onChange={e => setF({ ...f, district: e.target.value })}>
      <option value="">{f.region ? t('Select your district', 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆರಿಸಿ') : t('Choose your Kannada first', 'ಮೊದಲು ನಿಮ್ಮ ಕನ್ನಡ ಆರಿಸಿ')}</option>
      {(DISTRICTS[f.region] || []).map(d => <option key={d} value={d}>{dName(d)}</option>)}
     </select>
     <div className="flex gap-2"><button className="btn" disabled={saving}>{saving ? t('Saving…', 'ಉಳಿಸಲಾಗುತ್ತಿದೆ…') : t('Save changes', 'ಬದಲಾವಣೆ ಉಳಿಸಿ')}</button><button type="button" className="btn2" onClick={() => setEditing(false)}>{t('Cancel', 'ರದ್ದು')}</button></div>
    </form>
   )}

   {/* Level + stats */}
   <div className="card mb-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
     <div><div className="text-xs font-semibold uppercase tracking-wide text-muted">{t('Your level', 'ನಿಮ್ಮ ಹಂತ')}</div>
      <div className="font-display text-xl font-bold text-maroon dark:text-gold">{kn ? LEVELS[li][2] : LEVELS[li][1]}</div></div>
     <div className="text-right text-xs text-muted"><b className="text-base text-ink">{xp}</b> {t('XP')}{next && <> · {t(`${next[0] - xp} XP to ${next[1]}`, `${next[2]} ಹಂತಕ್ಕೆ ${next[0] - xp} XP`)}</>}</div>
    </div>
    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-maroon to-primary transition-all" style={{ width: `${pct}%` }} /></div>
    <p className="mt-2 text-[11px] text-muted">{t('Earn XP: 10 per word learned, 15 per region explored, plus points from games.', 'XP ಗಳಿಸಿ: ಕಲಿತ ಪ್ರತಿ ಪದಕ್ಕೆ 10, ನೋಡಿದ ಪ್ರತಿ ಪ್ರದೇಶಕ್ಕೆ 15, ಜೊತೆಗೆ ಆಟದ ಅಂಕಗಳು.')}</p>
   </div>

   <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
    <Stat icon={BookOpen} tint="#e0452b" l={t('Words learned', 'ಕಲಿತ ಪದಗಳು')} v={words} />
    <Stat icon={Compass} tint="#0e8fa3" l={t('Regions explored', 'ನೋಡಿದ ಪ್ರದೇಶಗಳು')} v={`${regions}/${REGIONS.length}`} />
    <Stat icon={Star} tint="#f59e0b" l={t('Points', 'ಅಂಕಗಳು')} v={points || 0} />
    <Stat icon={Trophy} tint="#7c3aed" l={t('Best score', 'ಅತ್ಯುತ್ತಮ ಅಂಕ')} v={best || 0} />
   </div>

   <div className="grid gap-5 lg:grid-cols-2">
    <div className="space-y-5">
     <div className="card"><h2 className="mb-3 font-display text-lg font-bold">{t('Your place on the map', 'ನಕ್ಷೆಯಲ್ಲಿ ನಿಮ್ಮ ಸ್ಥಾನ')}</h2>
      <RegionMap me={{ region: r?.id || '', district: u.district }} className="mx-auto h-72 max-w-full" /></div>

     <div className="card"><h2 className="mb-3 font-display text-lg font-bold">{t('Regions explored', 'ನೋಡಿದ ಪ್ರದೇಶಗಳು')}</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{REGIONS.map(x => { const done = Array.isArray(explored) && explored.includes(x.id); return (
       <Link key={x.id} href="/map" className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition hover:border-primary ${done ? 'border-green-600/40 bg-green-600/10' : 'border-border bg-surface2'}`}>
        <i className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: x.c }} /><span className="flex-1 truncate">{L.region(x.id)}</span>{done ? <Check size={14} className="text-green-600" /> : <Lock size={12} className="text-muted" />}
       </Link>) })}</div></div>
    </div>

    <div className="space-y-5">
     <div className="card space-y-3"><h2 className="font-display text-lg font-bold">{t('About your Kannada', 'ನಿಮ್ಮ ಕನ್ನಡದ ಬಗ್ಗೆ')}</h2>
      {r ? <>
       <div className="flex items-center gap-2"><i className="h-3.5 w-3.5 rounded-full" style={{ background: r.c }} /><p className="text-sm font-semibold">{rName}</p></div>
       <p className="text-sm text-muted">{t('Spoken in', 'ಮಾತನಾಡುವ ಪ್ರದೇಶ')}: {L.regionNote(r.id)}</p>
       <div><div className="mb-1.5 text-xs font-semibold text-muted">{t('Districts in your dialect area', 'ನಿಮ್ಮ ಉಪಭಾಷೆ ಪ್ರದೇಶದ ಜಿಲ್ಲೆಗಳು')}</div>
        <div className="flex flex-wrap gap-2">{(DISTRICTS[r.id] || []).map(d => <span key={d} className={`chip ${d.toLowerCase() === (u.district || '').toLowerCase() ? 'on' : ''}`}>{dName(d)}</span>)}</div></div>
       {myWords.length > 0 && <div><div className="mb-1.5 text-xs font-semibold text-muted">{t('Words from your dialect', 'ನಿಮ್ಮ ಉಪಭಾಷೆಯ ಪದಗಳು')}</div>
        <ul className="space-y-2">{myWords.map((e: any) => <li key={e.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface2 px-3 py-2"><div><div className="font-kn text-lg font-bold leading-tight">{e.kn}</div><div className="text-xs text-muted">{kn ? L.tr(e.en) : `${e.rom} · ${e.en}`}</div></div><Play t={e.kn} src={e.audio} /></li>)}</ul></div>}
      </> : <p className="text-sm text-muted">{t('Set your dialect to see details about your Kannada.', 'ನಿಮ್ಮ ಕನ್ನಡದ ವಿವರಗಳನ್ನು ನೋಡಲು ಉಪಭಾಷೆ ಆರಿಸಿ.')}</p>}
     </div>


     <div className="card"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-lg font-bold">{t('My contributions', 'ನನ್ನ ಕೊಡುಗೆಗಳು')}</h2><Link href="/contribute" className="text-xs font-semibold text-maroon underline dark:text-gold">{t('Add a word', 'ಪದ ಸೇರಿಸಿ')}</Link></div>
      {mine.length ? <ul className="space-y-2">{mine.map((e: any) => <li key={e.id} className="flex items-center justify-between gap-2 rounded-lg bg-surface2 p-2 text-sm">
       <span className="min-w-0"><b className="font-kn">{e.kn}</b> · {L.tr(e.en)}{e.status === 'pending' && <span className="ml-2 text-[11px] text-muted">{Math.min(e.votes || 0, VOTES_NEEDED)}/{VOTES_NEEDED} {t('approvals', 'ಅನುಮೋದನೆ')}</span>}</span><Badge s={e.status} /></li>)}</ul>
       : <p className="text-sm text-muted">{t('You haven’t contributed yet. Share a word or phrase from your dialect!', 'ನೀವು ಇನ್ನೂ ಕೊಡುಗೆ ನೀಡಿಲ್ಲ. ನಿಮ್ಮ ಉಪಭಾಷೆಯ ಪದವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ!')}</p>}</div>

    </div>
   </div>
  </div>
 )
}
