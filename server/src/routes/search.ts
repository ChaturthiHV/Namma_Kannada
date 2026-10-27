import { Router } from 'express'
import { q } from '../db'
import { wrap } from '../middleware/errors'
import { searchEntries } from '../lib/search'

const r = Router()

// GET /api/search?q=hogona&type=all|words|phrases|regions
r.get('/', wrap(async (req, res) => {
  const term = String(req.query.q || '').trim()
  const type = String(req.query.type || 'all')
  if (!term) return res.json({ entries: [], regions: [] })

  const entries = type === 'regions' ? [] : await searchEntries(term, { type })
  let regions: any[] = []
  if (type === 'all' || type === 'regions') {
    const like = '%' + term.replace(/[\\%_]/g, m => '\\' + m) + '%'
    regions = (await q('select id, name, note from regions where name ilike $1 or note ilike $1', [like])).rows
  }
  res.json({ entries, regions })
}))

export default r
