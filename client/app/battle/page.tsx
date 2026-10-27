'use client'
import { useState } from 'react'
import { PageHead, Play, Wave } from '@/components/ui'
import { useEntries, REGIONS, rn } from '@/lib/data'
export default function Battle() {
 const { all } = useEntries(); const [q, setQ] = useState('')
 const concepts = Array.from(new Set(all.map(e => e.concept))).map(c => all.find(e => e.concept === c)!).filter(e => e.en.toLowerCase().includes(q.toLowerCase()))
 const [c, setC] = useState('c1'); const opts = all.filter(e => e.concept === c)
 const [a, setA] = useState(0); const [b, setB] = useState(1); const [t, setT] = useState(0.5)
 const A = opts[a % Math.max(opts.length, 1)], B = opts[b % Math.max(opts.length, 1)]
 const Card = ({ e, op, side }: any) => e ? (
  <div className="card" style={{ opacity: op }}><div className="mb-2 flex justify-between"><b>{rn(e.region)}</b><Play t={e.kn} /></div>
   <div className="font-kn text-3xl font-bold">{e.kn}</div><div>{e.rom}</div><div className="mb-2 text-xs text-muted">{e.en} · {e.ctx}</div><Wave n={18} /></div>) : <div className="card text-sm">Pick a concept with 2+ regions.</div>
 return (
  <div className="p-5"><PageHead en="Dialect Battle" kn="ಉಪಭಾಷೆ ಸ್ಪರ್ಧೆ" sub="Same meaning, different regions. Never merged." />
   <input className="inp mb-3 max-w-md" placeholder="Search a meaning…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search meaning" />
   <div className="mb-4 flex flex-wrap gap-2">{concepts.map(x => <button key={x.concept} onClick={() => { setC(x.concept); setA(0); setB(1) }} className={`chip ${c === x.concept ? 'on' : ''}`}>{x.en}</button>)}</div>
   <div className="mb-3 flex gap-3 text-sm">{[[a, setA], [b, setB]].map(([v, f]: any, i) => <select key={i} aria-label={`Region ${i + 1}`} className="inp w-auto" value={v % opts.length} onChange={e => f(+e.target.value)}>{opts.map((o, j) => <option key={o.id} value={j}>{rn(o.region)}</option>)}</select>)}</div>
   <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]"><Card e={A} op={1 - t * 0.6} /><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary font-bold text-onprimary shadow-glow">VS</div><Card e={B} op={0.4 + t * 0.6} /></div>
   <label className="mt-5 block text-sm">Morph focus: {rn(A?.region || '')} ↔ {rn(B?.region || '')}<input type="range" min={0} max={1} step={0.01} value={t} onChange={e => setT(+e.target.value)} className="w-full accent-[#ffc21a]" /></label>
  </div>
 )
}
