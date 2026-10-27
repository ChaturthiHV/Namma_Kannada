import { Router } from 'express'
import { q } from '../db'
import { HttpError, wrap } from '../middleware/errors'
import { ENTRY_SELECT } from '../lib/serialize'

const r = Router()

const REGION_SELECT = `
  select r.id, r.name, r.color, r.note, r.weight, r.dialect_group as "dialectGroup", r.description, r.hero_image as "heroImage",
    coalesce((select array_agg(d.name order by d.name) from districts d where d.region_id = r.id), '{}') as districts,
    (select count(*)::int from entries e where e.region_id = r.id and e.status = 'verified') as "verifiedCount",
    (select count(*)::int from entries e where e.region_id = r.id and e.status = 'pending') as "pendingCount",
    (select count(*)::int from audio a join entries e on e.id = a.entry_id where e.region_id = r.id) as "audioCount"
  from regions r`

r.get('/', wrap(async (_req, res) => {
  const { rows } = await q(`${REGION_SELECT} order by r.weight desc`)
  res.json({ regions: rows })
}))

r.get('/:id', wrap(async (req, res) => {
  const { rows } = await q(`${REGION_SELECT} where r.id = $1`, [req.params.id])
  if (!rows[0]) throw new HttpError(404, 'Region not found.')
  const entries = await q(`${ENTRY_SELECT} where e.region_id = $1 and e.status = 'verified' order by e.seq`, [req.params.id])
  res.json({ region: rows[0], entries: entries.rows })
}))

export default r
