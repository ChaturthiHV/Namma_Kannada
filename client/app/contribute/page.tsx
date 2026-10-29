'use client'
import { useEffect, useRef, useState } from 'react'
import { Mic, Square, RotateCcw, Trash2 } from 'lucide-react'
import { PageHead, Badge, Play } from '@/components/ui'
import { useEntries, REGIONS, VOTES_NEEDED } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
import { useUser, findRegion } from '@/lib/auth'
const BAD = ['slur1', 'abuse1']
export default function Contribute() {
 const L = useI18n(); const { t, tr, nm } = L; const { all, set, vote, hasVoted } = useEntries(); const user = useUser(); const me = user ? { ...user, region: findRegion(user.region, user.district)?.id || user.region } : null; const [vmsg, setVmsg] = useState<{ msg: string; err?: boolean } | null>(null); const [f, setF] = useState<any>({ region: 'mysuru' }); const [tab, setTab] = useState('verified'); const [msg, setMsg] = useState<{ k: string; v?: any } | null>(null); const [ok, setOk] = useState(false)
 const [rec, setRec] = useState(false); const [blob, setBlob] = useState<Blob | null>(null); const [url, setUrl] = useState(''); const [secs, setSecs] = useState(0); const [micErr, setMicErr] = useState('')
 const mr = useRef<MediaRecorder | null>(null); const chunks = useRef<Blob[]>([]); const tick = useRef<any>(null); const t0 = useRef(0)
 useEffect(() => () => { clearInterval(tick.current); try { mr.current?.stream.getTracks().forEach(x => x.stop()) } catch {} }, [])
 const start = async () => {
  setMicErr('')
  try {
   const s = await navigator.mediaDevices.getUserMedia({ audio: true })
   const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find(x => (window as any).MediaRecorder?.isTypeSupported?.(x)) || ''
   const m = new MediaRecorder(s, type ? { mimeType: type } : undefined); chunks.current = []
   m.ondataavailable = x => x.data.size && chunks.current.push(x.data)
   m.onstop = () => { s.getTracks().forEach(x => x.stop()); clearInterval(tick.current); const b = new Blob(chunks.current, { type: (m.mimeType || type || 'audio/webm').split(';')[0] }); setSecs(Math.round((Date.now() - t0.current) / 1000)); setBlob(b); setUrl(URL.createObjectURL(b)) }
   m.start(); t0.current = Date.now(); setSecs(0); mr.current = m; setRec(true); tick.current = setInterval(() => { const n = Math.round((Date.now() - t0.current) / 1000); setSecs(n); if (n >= 15) stop() }, 250)
  } catch { setMicErr('Microphone unavailable. Please allow microphone access.') }
 }
 const stop = () => { if (mr.current?.state === 'recording') mr.current.stop(); setRec(false) }
 const clearRec = () => { if (url) URL.revokeObjectURL(url); setBlob(null); setUrl(''); setSecs(0) }
 const toDataUrl = (b: Blob) => new Promise<string>(res => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => res(''); r.readAsDataURL(b) })
 const dup = all.find(e => e.region === f.region && e.kn === f.kn)
 useEffect(() => { if (me?.region) setF((p: any) => (p.touched ? p : { ...p, region: me.region })) }, [me?.region])
 const submit = async () => {
  if (!f.kn || !f.en) return setMsg({ k: 'Kannada word and meaning are required.' })
  if (BAD.some(b => JSON.stringify(f).toLowerCase().includes(b))) return setMsg({ k: 'Please keep it respectful.' })
  if (!ok) return setMsg({ k: 'Please confirm the consent box.' })
  const audio = blob && blob.size < 1_500_000 ? await toDataUrl(blob) : undefined // demo mode keeps the clip on this device; with a server it is uploaded
  set({ id: 'u' + Date.now(), concept: 'u' + f.en, en: f.en, region: f.region, kn: f.kn, rom: '', status: 'pending', ctx: f.ex || 'Community', ex: f.ex, by: me?.phone, votes: 0, audio, blob, dur: secs })
  setF({ region: f.region }); clearRec(); setOk(false); setMsg({ k: 'Thank you! It stays Pending until {n} speakers of {name} approve it, then it shows as Verified.', v: { n: VOTES_NEEDED, region: f.region } })
 }
 const u = (k: string) => ({ value: f[k] || '', onChange: (e: any) => setF({ ...f, [k]: e.target.value, touched: true }), className: 'inp' })
 return (
  <div className="p-4 sm:p-5"><PageHead en="Contribute a Word" kn="ಪದ ಕೊಡುಗೆ" sub={t('Every contribution needs {n} approvals from speakers of the same dialect to become Verified.', { n: VOTES_NEEDED })} />
   <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
    <div className="card space-y-3">
     <div className="grid gap-3 sm:grid-cols-2"><input {...u('kn')} placeholder={t('Kannada script')} aria-label={t('Kannada script')} /><input {...u('en')} placeholder={t('English meaning')} aria-label={t('Meaning')} /></div>
     <select {...u('region')} aria-label={t('Region')}>{REGIONS.map(r => <option key={r.id} value={r.id}>{L.region(r.id)}</option>)}</select><textarea {...u('ex')} rows={2} className="inp resize-none" placeholder={t('Example sentence (optional)')} aria-label={t('Example')} />
     {dup && <p className="text-sm text-amber-600">{t('Similar entry exists ({kn}). Add it as a variant only if different.', { kn: dup.kn })}</p>}
     <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border p-3">
      <div className="min-w-0 flex-1 basis-56"><div className="text-sm font-semibold">{t('Record your voice (optional)')}</div>
      <p className="text-xs text-muted">{t('Say the word or sentence so others can hear how it sounds in your dialect.')}</p></div>
      <div className="flex flex-wrap items-center gap-2">
       {!rec ? <button type="button" className="btn !bg-red-600 !text-white" onClick={start}><Mic size={16} />{t(blob ? 'Record again' : 'Record')}</button> : <button type="button" className="btn !bg-red-600 !text-white animate-pulse" onClick={stop}><Square size={16} />{t('Stop')}</button>}
       {rec && <span role="status" className="text-xs">{t('Recording… tap Stop when done')} · {secs}s</span>}
       {blob && !rec && <button type="button" className="btn2" onClick={clearRec}><Trash2 size={14} />{t('Remove recording')}</button>}
      </div>
      {url && !rec && <div className="basis-full"><div className="text-xs text-muted">{t('Your recording')}</div><audio controls src={url} className="w-full" /></div>}
      {micErr && <p role="alert" className="basis-full text-sm text-red-600">{t(micErr)}</p>}
     </div>
     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex min-w-0 flex-1 items-start gap-2 text-xs"><input type="checkbox" className="mt-0.5" checked={ok} onChange={e => setOk(e.target.checked)} />{t(blob ? 'I recorded this myself and agree to share my voice openly.' : 'I wrote this myself and agree to share it openly.')}</label>
      <button className="btn2 shrink-0 justify-center" onClick={submit}>{t('Submit for Review')}</button></div>
     {msg && <p role="status" className="text-sm">{t(msg.k, msg.v ? { ...msg.v, name: L.region(msg.v.region) } : undefined)}</p>}</div>
    <div className="card min-w-0 lg:sticky lg:top-5 lg:max-h-[calc(100vh-2.5rem)] lg:overflow-y-auto"><div className="mb-3 flex flex-wrap gap-2">{['verified', 'pending'].map(k => <button key={k} onClick={() => setTab(k)} aria-pressed={tab === k} className={`chip ${tab === k ? 'on' : ''}`}>{t(k)} · {all.filter(e => e.status === k).length}</button>)}</div>
     {tab === 'pending' && vmsg && <p role="status" className={`mb-2 text-sm ${vmsg.err ? 'text-red-600' : 'text-green-700 dark:text-green-400'}`}>{vmsg.msg}</p>}
     <ul className="space-y-2">{all.filter(e => e.status === tab).map(e => {
      const pending = e.status === 'pending', voted = hasVoted(e, me), mine = !!me && e.by === me.phone, sameDialect = !!me && me.region === e.region
      const n = Math.min(e.votes || 0, VOTES_NEEDED)
      return <li key={e.id} className="rounded-lg bg-surface2 p-3 text-sm">
       <div className="flex flex-wrap items-center justify-between gap-2"><span className="flex min-w-0 flex-1 basis-48 items-center gap-2"><Play t={e.kn} src={e.audio} label={t('Hear how it sounds')} /><span className="min-w-0"><b className="font-kn">{e.kn}</b> · {tr(e.en)} · {L.region(e.region)}{e.audio && <span className="ml-2 text-[11px] text-muted">{t('🎙 Community recording')}</span>}</span></span><Badge s={e.status} /></div>
       {pending && <div className="mt-2 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1 basis-40"><div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/15"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(n / VOTES_NEEDED) * 100}%` }} /></div><div className="mt-1 text-[11px] text-muted">{t('{a}/{b} approvals from {name} speakers', { a: n, b: VOTES_NEEDED, name: L.region(e.region) })}</div>{me && !sameDialect && <div className="mt-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">{t('🔒 Only {name} speakers can approve this', { name: L.region(e.region) })}</div>}</div>
        <button className="chip" disabled={voted || mine || !sameDialect} title={mine ? t('You submitted this') : !sameDialect ? t('Only {name} speakers can approve', { name: L.region(e.region) }) : voted ? t('You approved this') : t('Approve')} onClick={async () => setVmsg(await vote(e, me, L))} aria-disabled={voted || mine || !sameDialect}>{voted ? t('✓ Approved') : mine ? t('Yours') : t('Approve')}</button>
       </div>}
      </li>
     })}</ul></div>
   </div></div>
 )
}
