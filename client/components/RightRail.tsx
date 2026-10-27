import { MessageCircle, Users, UserRound, ArrowRight } from 'lucide-react'
const stats = [{ n: '1,250+', l: 'Words & Phrases', i: MessageCircle }, { n: '8', l: 'Regions', i: Users }, { n: '3,420+', l: 'Contributors', i: UserRound }]
const pop = [['Mysuru', '#d9a441'], ['Coastal', '#3aa6b9'], ['Malnad', '#3f7a3a']]
export default function RightRail() {
  return (
    <aside className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-[#ffe08a] to-[#ffc21a] p-5 shadow-card text-[#3a1218]">
        <h2 className="font-display text-3xl font-bold leading-tight text-maroon">Keep<br />Kannada<br />Alive</h2>
        <p className="mt-2 text-xs">Contribute. Preserve.<br />Be a part of the journey.</p>
        <button className="mt-3 flex items-center gap-2 rounded-lg bg-maroon px-4 py-2 text-xs font-semibold text-white">Add a Word <ArrowRight size={14} /></button>
      </div>
      <div className="rounded-2xl bg-surface p-4 shadow-card">
        <h3 className="font-display text-lg font-bold text-maroon dark:text-gold">Quick Stats</h3>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {stats.map(({ n, l, i: Icon }) => (
            <div key={l} className="rounded-lg bg-surface2 p-2 text-center">
              <Icon size={22} className="mx-auto text-primary" />
              <div className="font-bold text-sm">{n}</div><div className="text-[9px] text-muted">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-surface p-4 shadow-card">
        <div className="flex justify-between"><h3 className="font-display text-lg font-bold text-maroon dark:text-gold">Popular Regions</h3><a className="text-[10px] font-semibold text-maroon dark:text-gold" href="#">View All →</a></div>
        <div className="mt-3 flex justify-around">
          {pop.map(([n, c]) => (
            <div key={n} className="text-center text-xs font-medium">
              <div className="mx-auto mb-1 h-14 w-14 rounded-full border-2 border-white shadow-card" style={{ background: c }} />{n}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
