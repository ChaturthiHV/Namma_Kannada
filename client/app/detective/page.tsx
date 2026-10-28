'use client'
import { useEffect, useRef, useState } from 'react'
import { PageHead, Play, Wave } from '@/components/ui'
import { useEntries, REGIONS, useLS } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
import { Flame } from 'lucide-react'
import { API, api } from '@/lib/api'
export default function Detective() {
 const { t, tr, region } = useI18n(); const { all } = useEntries(); const pool = all.filter(e => e.status === 'verified')
 const [used, setUsed] = useState<string[]>([]); const [cur, setCur] = useState<any>(null); const [opts, setOpts] = useState<string[]>([])
 const [score, setScore] = useState(0); const [streak, setStreak] = useState(0); const [tm, setTm] = useState(15); const [res, setRes] = useState(''); const [best, setBest] = useLS('best', 0)
 const [sid, setSid] = useState(''); const sent = useRef(false)
 const [exp, setExp] = useLS<string[]>('explored', []); const [, setPts] = useLS('points', 0)
 // Server mode: the server picks questions, runs the clock and scores answers (cannot be cheated from the browser).
 const apiNext = async (restart: boolean) => {
  try {
   const d = await api(restart ? '/quiz/start' : '/quiz/next', { method: 'POST', json: { sessionId: sid } })
   if (d.done) return setCur(null)
   const q = d.question; setSid(d.sessionId); sent.current = false; setCur({ id: q.id, kn: q.kn, en: q.en, region: '' }); setOpts(q.options); setUsed(restart ? [q.id] : [...used, q.id]); setTm(q.timeLimit); setRes('')
  } catch { setCur(null) }
 }
 const next = (u = used) => {
  if (API) return apiNext(u.length === 0)
  const left = pool.filter(e => !u.includes(e.id)); if (!left.length) { setCur(null); return }
  const e = left[Math.floor(Math.random() * left.length)]
  const o = [e.region, ...REGIONS.filter(r => r.id !== e.region).sort(() => Math.random() - 0.5).slice(0, 3).map(r => r.id)].sort(() => Math.random() - 0.5)
  setCur(e); setOpts(o); setUsed([...u, e.id]); setTm(15); setRes('')
 }
 useEffect(() => { if (!cur || res) return; if (tm <= 0) { ans(''); return }; const i = setTimeout(() => setTm(tm - 1), 1000); return () => clearTimeout(i) })
 const ans = (r: string) => {
  if (API) { if (sent.current) return; sent.current = true } 
  if (API) return api('/quiz/answer', { method: 'POST', json: { sessionId: sid, region: r } }).then(d => {
   setRes(d.correct ? 'right' : 'wrong'); setCur((c: any) => ({ ...c, region: d.correctRegion })); setScore(d.score); setStreak(d.streak)
   if (d.score > best) setBest(d.score); if (d.correct && !exp.includes(d.correctRegion)) setExp([...exp, d.correctRegion])
  }).catch(() => setRes('wrong'))
  const ok = r === cur.region; setRes(ok ? 'right' : 'wrong')
  if (ok) { const s = score + 10 + tm * 2 + streak * 5; setScore(s); setStreak(streak + 1); if (s > best) setBest(s); if (!exp.includes(r)) setExp([...exp, r]) } else setStreak(0)
 }
 return (
  <div className="p-5"><PageHead en="Dialect Detective" kn="ಉಪಭಾಷೆ ಪತ್ತೇದಾರ" sub={t('Guess the region. No login needed.')} />
   <div className="mx-auto max-w-xl rounded-2xl bg-[#2a1608] p-6 text-amber-100 shadow-card">
    <div className="mb-4 flex justify-between text-sm"><span>{t('Score {score} · Best {best}', { score, best })}</span><span className="flex items-center gap-1"><Flame size={16} className="text-orange-400" />{streak}</span><span aria-live="polite">{t('⏱ {n}s', { n: cur ? tm : 0 })}</span></div>
    {!cur ? <div className="text-center"><p className="mb-3">{used.length ? t('Round over! Final score {score}.', { score }) : t('Ready, detective?')}</p><button className="btn" onClick={() => { setScore(0); setStreak(0); next([]) }}>{used.length ? t('Play again') : t('Start')}</button></div> : <>
     <div className="mb-4 flex items-center gap-3 rounded-xl bg-black/30 p-4"><Play t={cur.kn} /><div><div className="font-kn text-2xl font-bold">{cur.kn}</div><div className="text-xs opacity-70">{t('“{en}” — which region?', { en: tr(cur.en) })}</div></div><Wave n={14} /></div>
     <div className="grid grid-cols-2 gap-3">{opts.map(o => <button key={o} disabled={!!res} onClick={() => ans(o)} className={`rounded-xl border border-amber-200/30 px-3 py-3 text-sm font-semibold ${res && o === cur.region ? 'bg-green-600' : 'bg-white/10 hover:bg-white/20'}`}>{region(o)}{res && o === cur.region ? ' ✓' : ''}</button>)}</div>
     {res && <div className="mt-4 flex items-center justify-between" role="status"><span>{res === 'right' ? t('🎉 Correct!') : t('Not quite — it was {name}.', { name: region(cur.region) })}</span><button className="btn" onClick={() => next()}>{t('Next')}</button></div>}</>}
   </div></div>
 )
}
