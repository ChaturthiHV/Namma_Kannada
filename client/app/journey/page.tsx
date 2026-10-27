'use client'
import { PageHead, Phrase, Play } from '@/components/ui'
import { useEntries, useLS, REGIONS, rn } from '@/lib/data'
export default function Journey() {
 const { all } = useEntries(); const [learned, setL] = useLS<string[]>('learned', []); const [exp] = useLS<string[]>('explored', []); const [best] = useLS('best', 0)
 const next = all.find(e => e.status === 'verified' && !learned.includes(e.id)); const rec = REGIONS.find(r => !exp.includes(r.id))
 const T = ({ l, v }: any) => <div className="card text-center"><div className="text-2xl font-bold">{v}</div><div className="text-xs text-muted">{l}</div></div>
 return (
  <div className="p-5"><PageHead en="Learning Journey" kn="ಕಲಿಕೆಯ ಪಯಣ" sub="ನಮಸ್ಕಾರ! Welcome back." />
   <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4"><T l="Words learned" v={learned.length} /><T l="Regions explored" v={`${exp.length}/${REGIONS.length}`} /><T l="Best score" v={best} /><T l="Level" v={1 + Math.floor(learned.length / 5)} /></div>
   <div className="grid gap-5 md:grid-cols-2">
    <div className="card"><h2 className="mb-3 font-display text-lg font-bold">Continue learning</h2>{next ? <><div className="flex items-center justify-between"><Phrase e={next} /><Play t={next.kn} /></div><button className="btn mt-3" onClick={() => setL([...learned, next.id])}>Mark learned</button></> : <p className="text-sm">All caught up! 🎉</p>}</div>
    <div className="card"><h2 className="mb-3 font-display text-lg font-bold">Recommended for you</h2><p className="text-sm">{rec ? `Explore ${rec.n} on the map to earn a new stamp.` : 'Try a timed round of Dialect Detective.'}</p></div></div></div>
 )
}
