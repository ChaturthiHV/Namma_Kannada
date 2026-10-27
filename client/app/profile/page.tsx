'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser, logout, updateProfile, DISTRICTS } from '@/lib/auth'
import { REGIONS, useLS } from '@/lib/data'
import RegionMap from '@/components/RegionMap'
import { AuthScreen } from '@/components/AuthGate'
import { PageHead } from '@/components/ui'

const fg = (h?: string) => { const n = parseInt((h || '#8e1015').slice(1), 16); const y = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)); return y > 150 ? '#3a1218' : '#fff' }
const T = ({ l, v }: any) => <div className="card text-center"><div className="text-2xl font-bold text-ink">{v}</div><div className="text-xs text-muted">{l}</div></div>

export default function ProfilePage() {
 const u = useUser()
 const [ready, setReady] = useState(false)
 const [editing, setEditing] = useState(false)
 const [f, setF] = useState({ name: '', region: '', district: '' })
 const [saving, setSaving] = useState(false)
 const [msg, setMsg] = useState<{ text: string; err: boolean } | null>(null)
 const [learned] = useLS<string[]>('learned', [])
 const [explored] = useLS<string[]>('explored', [])
 const [points] = useLS<number>('points', 0)
 const [best] = useLS<number>('best', 0)
 const [l] = useLS('lang', 'en')

 // useUser starts as null until the session is read; wait so logged-in users don't flash the login form
 useEffect(() => { setReady(true) }, [])

 const startEdit = () => { if (!u) return; setF({ name: u.name, region: u.region, district: u.district }); setMsg(null); setEditing(true) }
 const save = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!f.name.trim()) return setMsg({ text: 'Please enter your name.', err: true })
  if (!f.region) return setMsg({ text: 'Please choose your Kannada.', err: true })
  if (!f.district) return setMsg({ text: 'Please select your district.', err: true })
  setSaving(true); setMsg(null)
  const err = await updateProfile({ name: f.name.trim(), region: f.region, district: f.district })
  setSaving(false)
  if (err) setMsg({ text: err, err: true })
  else { setMsg({ text: 'Profile updated.', err: false }); setEditing(false) }
 }

 if (!ready) return <div className="p-5"><PageHead en="My Profile" kn="ನನ್ನ ಪ್ರೊಫೈಲ್" /></div>

 if (!u) return (
  <div className="p-5"><PageHead en="My Profile" kn="ನನ್ನ ಪ್ರೊಫೈಲ್" sub="Log in or create an account to save your progress and light up your home on the map." />
   <div className="card max-w-md"><AuthScreen compact /></div></div>
 )

 const r = REGIONS.find(x => x.id === u.region)
 const initial = (u.name?.trim()[0] || 'K').toUpperCase()
 const lc = (a: any) => (Array.isArray(a) ? a.length : 0)

 return (
  <div className="p-5"><PageHead en="My Profile" kn="ನನ್ನ ಪ್ರೊಫೈಲ್" sub={l === 'kn' ? 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಕನ್ನಡ ಪಯಣ ಇಲ್ಲಿದೆ.' : 'Your Kannada, your district, your progress.'} />

   <div className="card mb-5 flex flex-wrap items-center gap-4">
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-2xl font-bold" style={{ background: r?.c || '#8e1015', color: fg(r?.c) }}>{initial}</div>
    <div className="min-w-0 flex-1">
     <h2 className="truncate font-display text-xl font-bold">{u.name}</h2>
     <div className="text-xs text-muted">{u.phone && <>📞 {u.phone} · </>}📍 {u.district}</div>
     <span className="chip mt-2 inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: r?.c }} />{r?.n}</span>
    </div>
    <div className="flex gap-2">
     <button className="btn2" onClick={() => (editing ? setEditing(false) : startEdit())}>{editing ? 'Cancel' : 'Edit profile'}</button>
     <button className="btn2 !bg-danger" onClick={logout}>Log out</button>
    </div>
   </div>

   {msg && <p role="status" className={`mb-5 rounded-lg px-3 py-2 text-sm ${msg.err ? 'bg-danger/15 text-red-700 dark:text-red-300' : 'bg-green-600/15 text-green-700 dark:text-green-400'}`}>{msg.text}</p>}

   {editing && (
    <form onSubmit={save} className="card mb-5 max-w-2xl space-y-3">
     <h2 className="font-display text-lg font-bold">Edit your details</h2>
     <input className="inp" placeholder="Full name" aria-label="Full name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
     <div><div className="mb-2 text-xs font-semibold text-muted">Which Kannada do you speak?</div>
      <div className="flex flex-wrap gap-2">{REGIONS.map(x => <button type="button" key={x.id} aria-pressed={f.region === x.id} onClick={() => setF({ ...f, region: x.id, district: '' })} className={`chip flex items-center gap-2 ${f.region === x.id ? 'on' : ''}`}><i className="h-2.5 w-2.5 rounded-full" style={{ background: x.c }} />{x.n}</button>)}</div></div>
     <select className="inp" aria-label="District" value={f.district} disabled={!f.region} onChange={e => setF({ ...f, district: e.target.value })}>
      <option value="">{f.region ? 'Select your district' : 'Choose your Kannada first'}</option>
      {(DISTRICTS[f.region] || []).map(d => <option key={d} value={d}>{d}</option>)}
     </select>
     <div className="flex gap-2"><button className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button><button type="button" className="btn2" onClick={() => setEditing(false)}>Cancel</button></div>
    </form>
   )}

   <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
    <T l="Words learned" v={lc(learned)} /><T l="Regions explored" v={`${lc(explored)}/${REGIONS.length}`} /><T l="Points" v={points || 0} /><T l="Best score" v={best || 0} />
   </div>

   <div className="grid gap-5 lg:grid-cols-2">
    <div className="card"><h2 className="mb-3 font-display text-lg font-bold">Your place on the map</h2><RegionMap me={{ region: u.region, district: u.district }} className="mx-auto h-72 max-w-full" /></div>
    <div className="space-y-5">
     <div className="card space-y-2"><h2 className="font-display text-lg font-bold">About your Kannada</h2>
      <p className="text-sm font-semibold">{r?.n}</p><p className="text-sm text-muted">{r?.note}</p>
      <div className="flex flex-wrap gap-2 pt-1">{(DISTRICTS[u.region] || []).map(d => <span key={d} className={`chip ${d === u.district ? 'on' : ''}`}>{d}</span>)}</div></div>
     <div className="card space-y-2"><h2 className="font-display text-lg font-bold">Keep going</h2>
      <div className="flex flex-wrap gap-2">
       <Link className="btn" href="/map">Explore the map</Link><Link className="btn2" href="/speak">Speak like a local</Link>
       <Link className="btn2" href="/battle">Dialect Battle</Link><Link className="btn2" href="/contribute">Contribute a word</Link></div></div>
    </div>
   </div>
  </div>
 )
}
