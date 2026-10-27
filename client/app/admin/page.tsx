'use client'
import { PageHead, Play, Badge } from '@/components/ui'
import { useEntries, rn } from '@/lib/data'
import { Check, X } from 'lucide-react'
export default function Admin() {
 const { all, set } = useEntries()
 const log = (e: any, status: string) => { set({ ...e, status }); try { const l = JSON.parse(localStorage.getItem('modlog') || '[]'); localStorage.setItem('modlog', JSON.stringify([...l, { id: e.id, status, at: Date.now() }])) } catch {} }
 return (
  <div className="p-5"><PageHead en="Admin Verification" kn="ಪರಿಶೀಲನೆ" sub="Demo only: protect this route with auth in production." />
   <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs text-muted"><tr><th className="p-2">Word</th><th>Meaning</th><th>Region</th><th>Audio</th><th>Status</th><th>Action</th></tr></thead>
    <tbody>{all.map(e => <tr key={e.id} className="border-t border-border"><td className="p-2 font-kn font-bold">{e.kn}</td><td>{e.en}</td><td>{rn(e.region)}</td><td><Play t={e.kn} /></td><td><Badge s={e.status} /></td>
     <td className="space-x-2"><button aria-label="Approve" onClick={() => log(e, 'verified')} className="rounded-full bg-green-600 p-1.5 text-white"><Check size={14} /></button><button aria-label="Reject" onClick={() => log(e, 'rejected')} className="rounded-full bg-red-600 p-1.5 text-white"><X size={14} /></button><button className="chip" onClick={() => log(e, 'disputed')}>Dispute</button></td></tr>)}</tbody></table></div></div>
 )
}
