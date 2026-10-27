'use client'
import { useEffect, useRef, useState } from 'react'
import { PageHead, Play, Wave, Ring, Mascot, Phrase } from '@/components/ui'
import { useEntries, speak } from '@/lib/data'
import { API, api } from '@/lib/api'
import { Mic, Square, RotateCcw } from 'lucide-react'
export default function Speak() {
 const { all } = useEntries(); const [i, setI] = useState(0); const e = all[i % all.length]
 const [rec, setRec] = useState(false); const [url, setUrl] = useState(''); const [ok, setOk] = useState(false); const [err, setErr] = useState(''); const [score, setScore] = useState(0)
 const [blob, setBlob] = useState<Blob | null>(null); const [msg, setMsg] = useState(''); const [clips, setClips] = useState<any[]>([])
 const mr = useRef<MediaRecorder | null>(null); const chunks = useRef<Blob[]>([])
 const start = async () => {
  setErr('')
  try {
   const s = await navigator.mediaDevices.getUserMedia({ audio: true }); const m = new MediaRecorder(s); chunks.current = []
   m.ondataavailable = x => chunks.current.push(x.data)
   m.onstop = () => { const b = new Blob(chunks.current, { type: 'audio/webm' }); setBlob(b); setUrl(URL.createObjectURL(b)); s.getTracks().forEach(t => t.stop()) }
   m.start(); mr.current = m; setRec(true); setTimeout(() => m.state === 'recording' && stop(), 15000)
  } catch { setErr('Microphone unavailable. Upload an audio file instead.') }
 }
 const stop = () => { mr.current?.stop(); setRec(false) }
 const form = (b: Blob) => { const f = new FormData(); f.append('audio', b, 'recording.webm'); f.append('entryId', e.id); f.append('consent', 'true'); return f }
 const loadClips = () => { if (API && e) api(`/entries/${e.id}/audio`).then(d => setClips(d.audio)).catch(() => {}) }
 useEffect(loadClips, [e?.id])
 // Approximate automatic score (only when the server has speech recognition switched on)
 useEffect(() => { if (API && blob && ok) api('/pronunciation/score', { method: 'POST', body: form(blob) }).then(d => d.available && setScore(d.score)).catch(() => {}) }, [blob])
 const share = async () => { try { await api(`/entries/${e.id}/audio`, { method: 'POST', body: form(blob!) }); setMsg('Thank you! Your recording was shared.'); loadClips() } catch (x: any) { setErr(x.message) } }
 const both = () => { speak(e.kn); if (url) setTimeout(() => new Audio(url).play(), 2200) }
 return (
  <div className="p-5"><PageHead en="Speak Like a Local" kn="ಸ್ಥಳೀಯರಂತೆ ಮಾತು" sub="Listen, record, compare. Feedback is approximate, never pass/fail." />
   <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
    <div className="card space-y-4"><div className="flex items-center justify-between"><Phrase e={e} /><Play t={e.kn} /></div><Wave on={rec} n={32} />
     <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={ok} onChange={x => setOk(x.target.checked)} />{API ? 'I consent to my recording being scored and, only if I press Share, played for the community.' : 'I consent to my recording being played here (stays on this device).'}</label>
     <div className="flex flex-wrap gap-2">
      {!rec ? <button className="btn !bg-red-600 !text-white" disabled={!ok} onClick={start}><Mic size={16} />Record</button> : <button className="btn !bg-red-600 !text-white animate-pulse" onClick={stop}><Square size={16} />Stop</button>}
      <button className="btn2" onClick={both} disabled={!url}>Play both</button>
      <button className="btn2" onClick={() => { setUrl(''); setBlob(null); setScore(0); setMsg('') }}><RotateCcw size={14} />Try again</button>
      {API && <button className="btn2" disabled={!blob || !ok} onClick={share}>Share</button>}
      <button className="chip" onClick={() => setI(i + 1)}>Next phrase</button></div>
     {url && <audio controls src={url} className="w-full" />}
     <input type="file" accept="audio/*" className="text-xs" aria-label="Upload audio" onChange={x => { const f = x.target.files?.[0]; if (f) { setBlob(f); setUrl(URL.createObjectURL(f)) } }} />
     {msg && <p role="status" className="text-sm">{msg}</p>}
     {clips.length > 0 && <div className="space-y-1"><div className="text-xs text-muted">Community recordings</div>{clips.map(c => <audio key={c.id} controls src={c.url} className="w-full" />)}</div>}
     {err && <p role="alert" className="text-sm text-red-600">{err}</p>}</div>
    <div className="card flex flex-col items-center gap-3"><h2 className="font-display text-lg font-bold">How close did it feel?</h2><Ring v={score} />
     <div className="flex gap-2">{[40, 70, 95].map(v => <button key={v} disabled={!url} className="chip" onClick={() => setScore(v)}>{v === 40 ? 'Needs practice' : v === 70 ? 'Close' : 'Nailed it'}</button>)}</div>
     <Mascot mood={score > 80 ? '🥳' : '🎧'}>{score > 80 ? 'Shabash!' : 'Compare waveforms and rate yourself. Automatic scoring is approximate and only runs when switched on.'}</Mascot></div>
   </div></div>
 )
}
