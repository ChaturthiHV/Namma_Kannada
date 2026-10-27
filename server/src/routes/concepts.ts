import { Router } from 'express'
import { q } from '../db'
import { HttpError, wrap } from '../middleware/errors'
import { ENTRY_SELECT } from '../lib/serialize'

const r = Router()

/** Concept -> regional entries. This powers Dialect Battle (same meaning, different regions). */
r.get('/', wrap(async (req, res) => {
  const { rows } = await q(`${ENTRY_SELECT} where e.status <> 'rejected' order by e.seq`)
  const map = new Map<string, any>()
  for (const e of rows) {
    if (!map.has(e.concept)) map.set(e.concept, { id: e.concept, en: e.en, entries: [] })
    map.get(e.concept).entries.push(e)
  }
  let list = [...map.values()]
  if (req.query.battle === '1') list = list.filter(c => new Set(c.entries.map((e: any) => e.region)).size >= 2)
  res.json({ concepts: list })
}))

r.get('/:id', wrap(async (req, res) => {
  const c = await q('select id, english_meaning as en, standard_kannada as "standardKannada", category from concepts where id = $1', [req.params.id])
  if (!c.rows[0]) throw new HttpError(404, 'Concept not found.')
  const entries = await q(`${ENTRY_SELECT} where e.concept_id = $1 and e.status <> 'rejected' order by e.seq`, [req.params.id])
  res.json({ concept: c.rows[0], entries: entries.rows })
}))

export default r
