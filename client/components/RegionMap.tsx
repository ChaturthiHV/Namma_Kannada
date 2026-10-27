'use client'
import { REGIONS } from '@/lib/data'
import { useUser, pinFor } from '@/lib/auth'
import { DISTRICT_GEO, MAP_VIEWBOX } from '@/lib/karnataka-geo'
export default function RegionMap({ sel, onPick, done = [], heat = false, me, className = 'mx-auto h-80' }: any) {
  const u = useUser(); const m = heat ? null : (me ?? u)
  const max = Math.max(...REGIONS.map(r => r.w))
  const pin = m?.region ? pinFor(m.region, m.district) : null
  return (
    <svg viewBox={MAP_VIEWBOX} className={className} role="group" aria-label="Karnataka dialect regions">
      {REGIONS.map(r => {
        const mine = m?.region === r.id
        return (
          <path key={r.id} d={r.p} fill={heat ? '#e8830a' : r.c} fillOpacity={heat ? 0.25 + 0.75 * r.w / max : m && !mine ? 0.4 : 1}
            stroke={mine ? '#ffc21a' : 'var(--text)'} strokeWidth={mine ? 3.5 : sel === r.id ? 3 : 1} tabIndex={0} role="button" aria-label={r.n + (mine ? ' (your region)' : '')}
            onClick={() => onPick?.(r.id)} onKeyDown={(e: any) => e.key === 'Enter' && onPick?.(r.id)}
            className={`cursor-pointer transition hover:brightness-110 ${mine ? 'nk-pulse' : ''}`}
            style={{ filter: done.includes(r.id) ? 'drop-shadow(0 0 6px #ffc21a)' : undefined }} />
        )
      })}
      <g pointerEvents="none" fill="none" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="0.4">
        {Object.entries(DISTRICT_GEO).map(([n, g]) => <path key={n} d={g.p} />)}
      </g>
      {pin && m && (
        <g pointerEvents="none">
          <circle cx={pin[0]} cy={pin[1]} r="5" fill="none" stroke="#ffc21a" strokeWidth="2"><animate attributeName="r" values="5;16" dur="1.6s" repeatCount="indefinite" /><animate attributeName="opacity" values="1;0" dur="1.6s" repeatCount="indefinite" /></circle>
          <circle cx={pin[0]} cy={pin[1]} r="4.5" fill="#fff" stroke="#8e1015" strokeWidth="2" />
          <text x={pin[0]} y={pin[1] - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" stroke="#8e1015" strokeWidth="3" paintOrder="stroke">{m.district}</text>
        </g>
      )}
    </svg>
  )
}
