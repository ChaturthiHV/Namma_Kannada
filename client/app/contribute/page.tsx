'use client'
import { useEffect, useState } from 'react'
import { PageHead, Badge } from '@/components/ui'
import { useEntries, REGIONS, rn, VOTES_NEEDED } from '@/lib/data'
import { useUser, findRegion } from '@/lib/auth'
const BAD = ['slur1', 'abuse1']
export default function Contribute() {
 const { all, set, vote, hasVoted } = useEntries(); const user = useUser(); const me = user ? { ...user, region: findRegion(user.region, user.district)?.id || user.region } : null; const [vmsg, setVmsg] = useState<{ msg: string; err?: boolean } | null>(null); const [f, setF] = useState<any>({ region: 'mysuru' }); const [tab, setTab] = useState('verified'); const [msg, setMsg] = useState(''); const [ok, setOk] = useState(false)
 const dup = all.find(e => e.region === f.region && (e.kn === f.kn || (f.rom && e.rom.toLowerCase() === f.rom.toLowerCase())))
 useEffect(() => { if (me?.region) setF((p: any) => (p.touched ? p : { ...p, region: me.region })) }, [me?.region])
 const submit = () => {
  if (!f.kn || !f.en) return setMsg('Kannada word and meaning are required.')
  if (BAD.some(b => JSON.stringify(f).toLowerCase().includes(b))) return setMsg('Please keep it respectful.')
  if (!ok) return setMsg('Please confirm the consent box.')
  set({ id: 'u' + Date.now(), concept: 'u' + f.en, en: f.en, region: f.region, kn: f.kn, rom: f.rom || '', status: 'pending', ctx: f.ex || 'Community', by: me?.phone, votes: 0 })
  setF({ region: f.region }); setMsg(`Thank you! It stays Pending until ${VOTES_NEEDED} speakers of ${rn(f.region)} approve it, then it shows as Verified.`)
 }
 const u = (k: string) => ({ value: f[k] || '', onChange: (e: any) => setF({ ...f, [k]: e.target.value, touched: true }), className: 'inp' })
 return (
  <div className="p-5"><PageHead en="Contribute a Word" kn="ಪದ ಕೊಡುಗೆ" sub={`Every contribution needs ${VOTES_NEEDED} approvals from speakers of the same dialect to become Verified.`} />
   <div className="grid gap-5 lg:grid-cols-2">
    <div className="card space-y-3"><input {...u('kn')} placeholder="Kannada script" aria-label="Kannada" /><input {...u('rom')} placeholder="Romanized (e.g. hogona)" aria-label="Romanized" /><input {...u('en')} placeholder="English meaning" aria-label="Meaning" />
     <select {...u('region')} aria-label="Region">{REGIONS.map(r => <option key={r.id} value={r.id}>{r.n}</option>)}</select><textarea {...u('ex')} placeholder="Example sentence (optional)" aria-label="Example" />
     {dup && <p className="text-sm text-amber-600">Similar entry exists ({dup.kn}). Add it as a variant only if different.</p>}
     <label className="flex gap-2 text-xs"><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} />I wrote this myself and agree to share it openly.</label>
     <button className="btn2 w-full justify-center" onClick={submit}>Submit for Review</button>{msg && <p role="status" className="text-sm">{msg}</p>}</div>
    <div className="card"><div className="mb-3 flex gap-2">{['verified', 'pending'].map(t => <button key={t} onClick={() => setTab(t)} className={`chip capitalize ${tab === t ? 'on' : ''}`}>{t}</button>)}</div>
     {tab === 'pending' && vmsg && <p role="status" className={`mb-2 text-sm ${vmsg.err ? 'text-red-600' : 'text-green-700 dark:text-green-400'}`}>{vmsg.msg}</p>}
     <ul className="space-y-2">{all.filter(e => e.status === tab).map(e => {
      const pending = e.status === 'pending', voted = hasVoted(e, me), mine = !!me && e.by === me.phone, sameDialect = !!me && me.region === e.region
      const n = Math.min(e.votes || 0, VOTES_NEEDED)
      return <li key={e.id} className="rounded-lg bg-surface2 p-2 text-sm">
       <div className="flex items-center justify-between gap-2"><span><b className="font-kn">{e.kn}</b> · {e.en} · {rn(e.region)}</span><Badge s={e.status} /></div>
       {pending && <div className="mt-2 flex items-center gap-3">
        <div className="flex-1"><div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/15"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(n / VOTES_NEEDED) * 100}%` }} /></div><div className="mt-1 text-[11px] text-muted">{n}/{VOTES_NEEDED} approvals from {rn(e.region)} speakers</div>{me && !sameDialect && <div className="mt-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">🔒 Only {rn(e.region)} speakers can approve this</div>}</div>
        <button className="chip" disabled={voted || mine || !sameDialect} title={mine ? 'You submitted this' : !sameDialect ? `Only ${rn(e.region)} speakers can approve` : voted ? 'You approved this' : 'Approve'} onClick={async () => setVmsg(await vote(e, me))} aria-disabled={voted || mine || !sameDialect}>{voted ? '✓ Approved' : mine ? 'Yours' : 'Approve'}</button>
       </div>}
      </li>
     })}</ul></div>
   </div></div>
 )
}
