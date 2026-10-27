'use client'
import { PageHead, Play, Phrase } from '@/components/ui'
import { useEntries, rn } from '@/lib/data'
// PLACEHOLDER stories: verify with native speakers.
const NOTES: any = { c5: 'Salt is central to hospitality on the coast; “uppu” appears in many blessings and proverbs.', c3: 'Asking “have you eaten?” is a warm greeting, a way of asking “are you well?”.' }
export default function Stories() {
 const { all } = useEntries(); const list = all.filter(e => e.status === 'verified'); const w = list[Math.floor(Date.now() / 864e5) % list.length]
 if (!w) return null
 return (
  <div className="p-5"><PageHead en="Stories Behind the Words" kn="ಪದದ ಕಥೆ" />
   <div className="card max-w-2xl space-y-4"><span className="chip on">Word of the Day · {rn(w.region)}</span><div className="flex items-center justify-between"><Phrase e={w} /><Play t={w.kn} /></div>
    <div className="rounded-xl bg-surface2 p-4 text-sm"><b>Cultural note</b><p className="mt-1">{NOTES[w.concept] || 'No story yet. Know one? Add it through Contribute a Word.'}</p></div></div>
   <h2 className="mb-2 mt-6 font-display text-xl font-bold">More stories</h2><div className="grid gap-3 md:grid-cols-2">{Object.keys(NOTES).map(c => { const e = all.find(x => x.concept === c); return e && <div key={c} className="card"><b className="font-kn">{e.kn}</b><p className="text-sm">{NOTES[c]}</p></div> })}</div></div>
 )
}
