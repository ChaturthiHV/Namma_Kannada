import { Router } from 'express'
import { z } from 'zod'
import { q } from '../db'
import { HttpError, wrap } from '../middleware/errors'
import { optionalAuth, requireRole } from '../middleware/auth'

const r = Router()

r.post('/', optionalAuth, wrap(async (req, res) => {
  const b = z.object({ entryId: z.string().min(1), reason: z.string().trim().min(3, 'Please say what is wrong.').max(500) }).parse(req.body)
  const { rows } = await q(
    'insert into reports (entry_id, reported_by, reason) values ($1,$2,$3) returning id, status',
    [b.entryId, req.user?.id || null, b.reason])
  res.status(201).json({ report: rows[0] })
}))

r.get('/', ...requireRole('reviewer', 'admin'), wrap(async (req, res) => {
  const status = String(req.query.status || 'open')
  const { rows } = await q(
    `select r.id, r.entry_id as "entryId", r.reason, r.status, r.created_at as "createdAt",
            e.kannada_script as kn, u.name as "reportedBy"
     from reports r join entries e on e.id = r.entry_id left join users u on u.id = r.reported_by
     where r.status = $1 order by r.created_at desc`, [status])
  res.json({ reports: rows })
}))

r.patch('/:id', ...requireRole('reviewer', 'admin'), wrap(async (req, res) => {
  const { status } = z.object({ status: z.enum(['open', 'resolved', 'dismissed']) }).parse(req.body)
  const { rowCount } = await q('update reports set status = $2 where id = $1', [req.params.id, status])
  if (!rowCount) throw new HttpError(404, 'Report not found.')
  res.json({ ok: true })
}))

export default r
