import { Router } from 'express'
import { q } from '../db'
import { wrap } from '../middleware/errors'

const r = Router()

// Returns { Shopping: { n0: { w, e: {kn, rom, en}, c: [[label, nextNode], ...] } } }: the shape the Talk page already uses
r.get('/', wrap(async (_req, res) => {
  const { rows } = await q(
    `select n.scenario_id, n.node_id, n.speaker, n.kn, n.rom, n.en, n.choices
     from scenario_nodes n join scenarios s on s.id = n.scenario_id order by s.sort, n.node_id`)
  const out: Record<string, any> = {}
  for (const n of rows) {
    out[n.scenario_id] ||= {}
    out[n.scenario_id][n.node_id] = { w: n.speaker, e: { kn: n.kn, rom: n.rom, en: n.en }, c: n.choices }
  }
  res.json({ scenarios: out })
}))

export default r
