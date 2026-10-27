import { Router } from 'express'
import { config } from '../config'
import { q } from '../db'
import { wrap } from '../middleware/errors'
import { ENTRY_SELECT } from '../lib/serialize'

const r = Router()

r.get('/health', wrap(async (_req, res) => {
  await q('select 1')
  res.json({ status: 'ok', time: new Date().toISOString() })
}))

// Home page counters + Living Map data
r.get('/stats', wrap(async (_req, res) => {
  const t = (await q(
    `select (select count(*)::int from entries where status = 'verified') as words,
            (select count(*)::int from regions) as regions,
            (select count(*)::int from users) as contributors,
            (select count(*)::int from entries where status = 'pending') as pending`)).rows[0]
  const perRegion = (await q(
    `select r.id, r.name,
       (select count(*)::int from entries e where e.region_id = r.id and e.status = 'verified') as verified,
       (select count(*)::int from audio a join entries e on e.id = a.entry_id where e.region_id = r.id) as audio
     from regions r order by verified desc`)).rows
  res.json({ ...t, perRegion })
}))

// Same word for everyone on a given day (IST by default)
r.get('/word-of-the-day', wrap(async (_req, res) => {
  const n = (await q(`select count(*)::int as n from entries where status = 'verified'`)).rows[0].n
  if (!n) return res.json({ entry: null })
  const day = Math.floor((Date.now() + 5.5 * 3600e3) / 86400e3)
  const { rows } = await q(`${ENTRY_SELECT} where e.status = 'verified' order by e.seq offset $1 limit 1`, [day % n])
  res.json({ entry: rows[0] })
}))

// Open Dictionary download (verified entries only)
r.get('/export/dictionary', wrap(async (req, res) => {
  const { rows } = await q(`${ENTRY_SELECT} where e.status = 'verified' order by e.seq`)
  if (req.query.format === 'csv') {
    const cols = ['id', 'concept', 'en', 'region', 'kn', 'rom', 'ctx']
    const cell = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = '\uFEFF' + cols.join(',') + '\n' + rows.map(e => cols.map(c => cell(e[c])).join(',')).join('\n')
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="namma-kannada-dictionary.csv"')
    return res.send(csv)
  }
  res.setHeader('Content-Disposition', 'attachment; filename="namma-kannada-dictionary.json"')
  res.json({ license: 'Community contributions, shared openly', generatedAt: new Date().toISOString(), entries: rows })
}))

export const timezone = config.timezone
export default r
