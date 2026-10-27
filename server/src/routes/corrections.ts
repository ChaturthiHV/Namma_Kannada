import { Router } from 'express'
import { z } from 'zod'
import { q, tx } from '../db'
import { HttpError, wrap } from '../middleware/errors'
import { requireAuth, requireRole } from '../middleware/auth'
import { isDisrespectful } from '../lib/moderation'

const r = Router()

// Whitelist: field name from the client -> real column (never interpolate client input into SQL)
const FIELD_COL: Record<string, string> = {
  kannada_script: 'kannada_script', romanized: 'romanized', ipa: 'ipa', literal_meaning: 'literal_meaning',
  context_tag: 'context_tag', example_sentence: 'example_sentence', example_translation: 'example_translation',
}

r.get('/entries/:id/corrections', wrap(async (req, res) => {
  const { rows } = await q(
    `select id, field, proposed_value as "proposedValue", votes, status, created_at as "createdAt"
     from corrections where entry_id = $1 order by votes desc, created_at`, [req.params.id])
  res.json({ corrections: rows })
}))

r.post('/entries/:id/corrections', requireAuth, wrap(async (req, res) => {
  const b = z.object({ field: z.enum(Object.keys(FIELD_COL) as [string, ...string[]]), proposedValue: z.string().trim().min(1).max(500) }).parse(req.body)
  if (isDisrespectful(b.proposedValue)) throw new HttpError(400, 'Please keep it respectful.')
  const { rows } = await q(
    'insert into corrections (entry_id, suggested_by, field, proposed_value) values ($1,$2,$3,$4) returning id, field, proposed_value as "proposedValue", votes, status',
    [req.params.id, req.user.id, b.field, b.proposedValue])
  res.status(201).json({ correction: rows[0] })
}))

r.post('/corrections/:id/vote', requireAuth, wrap(async (req, res) => {
  const ok = await tx(async c => {
    const ins = await c.query('insert into correction_votes (correction_id, user_id) values ($1,$2) on conflict do nothing', [req.params.id, req.user.id])
    if (ins.rowCount) await c.query('update corrections set votes = votes + 1 where id = $1', [req.params.id])
    return ins.rowCount === 1
  })
  if (!ok) throw new HttpError(409, 'You already voted on this correction.')
  res.json({ ok: true })
}))

// Reviewer accepts (applies to the entry, bumps version) or rejects
r.patch('/corrections/:id', ...requireRole('reviewer', 'admin'), wrap(async (req, res) => {
  const { status } = z.object({ status: z.enum(['accepted', 'rejected']) }).parse(req.body)
  await tx(async c => {
    const cor = (await c.query('select * from corrections where id = $1 for update', [req.params.id])).rows[0]
    if (!cor) throw new HttpError(404, 'Correction not found.')
    if (cor.status !== 'open') throw new HttpError(409, 'This correction was already handled.')
    if (status === 'accepted') {
      const col = FIELD_COL[cor.field]
      if (!col) throw new HttpError(400, 'Unsupported field.')
      await c.query(
        `insert into entry_versions (entry_id, version, snapshot, edited_by)
         select e.id, e.version, to_jsonb(e), $2 from entries e where e.id = $1`, [cor.entry_id, req.user.id])
      await c.query(`update entries set ${col} = $2, version = version + 1, updated_at = now() where id = $1`, [cor.entry_id, cor.proposed_value])
    }
    await c.query('update corrections set status = $2 where id = $1', [cor.id, status])
  })
  res.json({ ok: true })
}))

export default r
