'use client'
import { useEffect, useState } from 'react'
import { PageHead, Badge } from '@/components/ui'
import { useEntries, REGIONS, VOTES_NEEDED } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
import { useUser, findRegion } from '@/lib/auth'
const BAD = ['slur1', 'abuse1']
export default function Contribute() {
 const L = useI18n(); const { t, tr, nm } = L; const { all, set, vote, hasVoted } = useEntries(); const user = useUser(); const me = user ? { ...user, region: findRegion(user.region, user.district)?.id || user.region } : null; const [vmsg, setVmsg] = useState<{ msg: string; err?: boolean } | null>(null); const [f, setF] = useState<any>({ region: 'mysuru' }); const [tab, setTab] = useState('verified'); const [msg, setMsg] = useState<{ k: string; v?: any } | null>(null); const [ok, setOk] = useState(false)
 const dup = all.find(e => e.region === f.region && (e.kn === f.kn || (f.rom && e.rom.toLowerCase() === f.rom.toLowerCase())))
 useEffect(() => { if (me?.region) setF((p: any) => (p.touched ? p : { ...p, region: me.region })) }, [me?.region])
 const submit = () => {
  if (!f.kn || !f.en) return setMsg({ k: 'Kannada word and meaning are required.' })
  if (BAD.some(b => JSON.stringify(f).toLowerCase().includes(b))) return setMsg({ k: 'Please keep it respectful.' })
  if (!ok) return setMsg({ k: 'Please confirm the consent box.' })
  set({ id: 'u' + Date.now(), concept: 'u' + f.en, en: f.en, region: f.region, kn: f.kn, rom: f.rom || '', status: 'pending', ctx: f.ex || 'Community', by: me?.phone, votes: 0 })
  setF({ region: f.region }); setMsg({ k: 'Thank you! It stays Pending until {n} speakers of {name} approve it, then it shows as Verified.', v: { n: VOTES_NEEDED, region: f.region } })
 }
 const u = (k: string) => ({ value: f[k] || '', onChange: (e: any) => setF({ ...f, [k]: e.target.value, touched: true }), className: 'inp' })
 return (
  <div className="p-5"><PageHead en="Contribute a Word" kn="ಪದ ಕೊಡುಗೆ" sub={t('Every contribution needs {n} approvals from speakers of the same dialect to become Verified.', { n: VOTES_NEEDED })} />
   <div className="grid gap-5 lg:grid-cols-2">
    <div className="card space-y-3"><input {...u('kn')} placeholder={t('Kannada script')} aria-label={t('Kannada script')} /><input {...u('rom')} placeholder={t('Romanized (e.g. hogona)')} aria-label={t('Romanized')} /><input {...u('en')} placeholder={t('English meaning')} aria-label={t('Meaning')} />
     <select {...u('region')} aria-label={t('Region')}>{REGIONS.map(r => <option key={r.id} value={r.id}>{L.region(r.id)}</option>)}</select><textarea {...u('ex')} placeholder={t('Example sentence (optional)')} aria-label={t('Example')} />
     {dup && <p className="text-sm text-amber-600">{t('Similar entry exists ({kn}). Add it as a variant only if different.', { kn: dup.kn })}</p>}
     <label className="flex gap-2 text-xs"><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} />{t('I wrote this myself and agree to share it openly.')}</label>
     <button className="btn2 w-full justify-center" onClick={submit}>{t('Submit for Review')}</button>{msg && <p role="status" className="text-sm">{t(msg.k, msg.v ? { ...msg.v, name: L.region(msg.v.region) } : undefined)}</p>}</div>
    <div className="card"><div className="mb-3 flex gap-2">{['verified', 'pending'].map(k => <button key={k} onClick={() => setTab(k)} className={`chip ${tab === k ? 'on' : ''}`}>{t(k)}</button>)}</div>
     {tab === 'pending' && vmsg && <p role="status" className={`mb-2 text-sm ${vmsg.err ? 'text-red-600' : 'text-green-700 dark:text-green-400'}`}>{vmsg.msg}</p>}
     <ul className="space-y-2">{all.filter(e => e.status === tab).map(e => {
      const pending = e.status === 'pending', voted = hasVoted(e, me), mine = !!me && e.by === me.phone, sameDialect = !!me && me.region === e.region
      const n = Math.min(e.votes || 0, VOTES_NEEDED)
      return <li key={e.id} className="rounded-lg bg-surface2 p-2 text-sm">
       <div className="flex items-center justify-between gap-2"><span><b className="font-kn">{e.kn}</b> · {tr(e.en)} · {L.region(e.region)}</span><Badge s={e.status} /></div>
       {pending && <div className="mt-2 flex items-center gap-3">
        <div className="flex-1"><div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/15"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(n / VOTES_NEEDED) * 100}%` }} /></div><div className="mt-1 text-[11px] text-muted">{t('{a}/{b} approvals from {name} speakers', { a: n, b: VOTES_NEEDED, name: L.region(e.region) })}</div>{me && !sameDialect && <div className="mt-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">{t('🔒 Only {name} speakers can approve this', { name: L.region(e.region) })}</div>}</div>
        <button className="chip" disabled={voted || mine || !sameDialect} title={mine ? t('You submitted this') : !sameDialect ? t('Only {name} speakers can approve', { name: L.region(e.region) }) : voted ? t('You approved this') : t('Approve')} onClick={async () => setVmsg(await vote(e, me, L))} aria-disabled={voted || mine || !sameDialect}>{voted ? t('✓ Approved') : mine ? t('Yours') : t('Approve')}</button>
       </div>}
      </li>
     })}</ul></div>
   </div></div>
 )
}
