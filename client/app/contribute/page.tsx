'use client'
import { useState } from 'react'
import { PageHead, Badge } from '@/components/ui'
import { useEntries, REGIONS, rn } from '@/lib/data'
const BAD = ['slur1', 'abuse1']
export default function Contribute() {
 const { all, set } = useEntries(); const [f, setF] = useState<any>({ region: 'mysuru' }); const [tab, setTab] = useState('verified'); const [msg, setMsg] = useState(''); const [ok, setOk] = useState(false)
 const dup = all.find(e => e.region === f.region && (e.kn === f.kn || (f.rom && e.rom.toLowerCase() === f.rom.toLowerCase())))
 const submit = () => {
  if (!f.kn || !f.en) return setMsg('Kannada word and meaning are required.')
  if (BAD.some(b => JSON.stringify(f).toLowerCase().includes(b))) return setMsg('Please keep it respectful.')
  if (!ok) return setMsg('Please confirm the consent box.')
  set({ id: 'u' + Date.now(), concept: 'u' + f.en, en: f.en, region: f.region, kn: f.kn, rom: f.rom || '', status: 'pending', ctx: f.ex || 'Community' })
  setF({ region: f.region }); setMsg('Thank you! Sent for review.')
 }
 const u = (k: string) => ({ value: f[k] || '', onChange: (e: any) => setF({ ...f, [k]: e.target.value }), className: 'inp' })
 return (
  <div className="p-5"><PageHead en="Contribute a Word" kn="ಪದ ಕೊಡುಗೆ" sub="Every approval grows the shared dictionary." />
   <div className="grid gap-5 lg:grid-cols-2">
    <div className="card space-y-3"><input {...u('kn')} placeholder="Kannada script" aria-label="Kannada" /><input {...u('rom')} placeholder="Romanized (e.g. hogona)" aria-label="Romanized" /><input {...u('en')} placeholder="English meaning" aria-label="Meaning" />
     <select {...u('region')} aria-label="Region">{REGIONS.map(r => <option key={r.id} value={r.id}>{r.n}</option>)}</select><textarea {...u('ex')} placeholder="Example sentence (optional)" aria-label="Example" />
     {dup && <p className="text-sm text-amber-600">Similar entry exists ({dup.kn}). Add it as a variant only if different.</p>}
     <label className="flex gap-2 text-xs"><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} />I wrote this myself and agree to share it openly.</label>
     <button className="btn2 w-full justify-center" onClick={submit}>Submit for Review</button>{msg && <p role="status" className="text-sm">{msg}</p>}</div>
    <div className="card"><div className="mb-3 flex gap-2">{['verified', 'pending'].map(t => <button key={t} onClick={() => setTab(t)} className={`chip capitalize ${tab === t ? 'on' : ''}`}>{t}</button>)}</div>
     <ul className="space-y-2">{all.filter(e => e.status === tab).map(e => <li key={e.id} className="flex items-center justify-between rounded-lg bg-surface2 p-2 text-sm"><span><b className="font-kn">{e.kn}</b> · {e.en} · {rn(e.region)}</span><Badge s={e.status} /></li>)}</ul></div>
   </div></div>
 )
}
