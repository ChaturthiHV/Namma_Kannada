import { Router } from 'express'
import { z } from 'zod'
import { q } from '../db'
import { HttpError, wrap } from '../middleware/errors'
import { requireRole } from '../middleware/auth'

const r = Router()

r.get('/overview', ...requireRole('reviewer', 'admin'), wrap(async (_req, res) => {
  const { rows } = await q(
    `select
       (select count(*)::int from entries where status = 'pending')  as "pendingEntries",
       (select count(*)::int from entries where status = 'disputed') as "disputedEntries",
       (select count(*)::int from entries where status = 'verified') as "verifiedEntries",
       (select count(*)::int from reports where status = 'open')     as "openReports",
       (select count(*)::int from corrections where status = 'open') as "openCorrections",
       (select count(*)::int from users)                             as users`)
  res.json(rows[0])
}))

r.get('/moderation-log', ...requireRole('reviewer', 'admin'), wrap(async (_req, res) => {
  const { rows } = await q(
    `select m.id, m.entry_id as "entryId", e.kannada_script as kn, m.from_status as "from", m.to_status as "to",
            m.note, m.created_at as "createdAt", u.name as reviewer
     from moderation_log m left join entries e on e.id = m.entry_id left join users u on u.id = m.reviewer_id
     order by m.created_at desc limit 200`)
  res.json({ log: rows })
}))

r.get('/users', ...requireRole('admin'), wrap(async (_req, res) => {
  const { rows } = await q(
    `select id, name, phone, role, home_region as region, district, points, streak, created_at as "createdAt"
     from users order by created_at desc limit 500`)
  res.json({ users: rows })
}))

r.patch('/users/:id/role', ...requireRole('admin'), wrap(async (req, res) => {
  const { role } = z.object({ role: z.enum(['learner', 'contributor', 'reviewer', 'admin']) }).parse(req.body)
  if (req.params.id === req.user.id) throw new HttpError(400, 'You cannot change your own role.')
  const { rowCount } = await q('update users set role = $2 where id = $1', [req.params.id, role])
  if (!rowCount) throw new HttpError(404, 'User not found.')
  res.json({ ok: true })
}))

export default r
