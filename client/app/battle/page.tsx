'use client'
import { useState } from 'react'
import { PageHead, Play, Wave } from '@/components/ui'
import { useEntries } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
export default function Battle() {
 const L = useI18n(); const { t, tr, region } = L; const { all } = useEntries(); const [q, setQ] = useState('')
 const concepts = Array.from(new Set(all.map(e => e.concept))).map(c => all.find(e => e.concept === c)!).filter(e => [e.en, tr(e.en)].some(x => x.toLowerCase().includes(q.toLowerCase())))
 const [c, setC] = useState('c1'); const opts = all.filter(e => e.concept === c)
 const [a, setA] = useState(0); const [b, setB] = useState(1); const [mix, setMix] = useState(0.5)
 const A = opts[a % Math.max(opts.length, 1)], B = opts[b % Math.max(opts.length, 1)]
 const Card = ({ e, op, side }: any) => e ? (
  <div className="card" style={{ opacity: op }}><div className="mb-2 flex items-center justify-between gap-2"><b>{region(e.region)}</b><Play t={e.kn} src={e.audio} /></div>
   <div className="font-kn text-3xl font-bold">{e.kn}</div>{!L.kn && <div>{e.rom}</div>}<div className="mb-2 text-xs text-muted">{tr(e.en)} · {t(e.ctx)}</div><Wave n={18} /></div>) : <div className="card text-sm">{t('Pick a concept with 2+ regions.')}</div>
 return (
  <div className="p-4 sm:p-5"><PageHead en="Dialect Battle" kn="ಉಪಭಾಷೆ ಸ್ಪರ್ಧೆ" sub={t('Same meaning, different regions. Never merged.')} />
   <input className="inp mb-3 max-w-md" placeholder={t('Search a meaning…')} value={q} onChange={e => setQ(e.target.value)} aria-label={t('Search meaning')} />
   <div className="mb-4 flex flex-wrap gap-2">{concepts.map(x => <button key={x.concept} onClick={() => { setC(x.concept); setA(0); setB(1) }} className={`chip ${c === x.concept ? 'on' : ''}`}>{tr(x.en)}</button>)}</div>
   <div className="mb-3 flex flex-wrap gap-3 text-sm">{[[a, setA], [b, setB]].map(([v, f]: any, i) => <select key={i} aria-label={t('Region {n}', { n: i + 1 })} className="inp min-w-0 flex-1 sm:w-auto sm:flex-none" value={v % opts.length} onChange={e => f(+e.target.value)}>{opts.map((o, j) => <option key={o.id} value={j}>{region(o.region)}</option>)}</select>)}</div>
   <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]"><Card e={A} op={1 - mix * 0.6} /><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary font-bold text-onprimary shadow-glow">{t('VS')}</div><Card e={B} op={0.4 + mix * 0.6} /></div>
   <label className="mt-5 block text-sm">{t('Morph focus: {a} ↔ {b}', { a: region(A?.region || ''), b: region(B?.region || '') })}<input type="range" min={0} max={1} step={0.01} value={mix} onChange={e => setMix(+e.target.value)} className="w-full accent-[#ffc21a]" /></label>
  </div>
 )
}
