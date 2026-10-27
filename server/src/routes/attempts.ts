import { Router } from 'express'
import { z } from 'zod'
import { q, tx } from '../db'
import { wrap } from '../middleware/errors'
import { requireAuth } from '../middleware/auth'
import { touchActivity } from '../lib/streak'

const r = Router()

r.post('/', requireAuth, wrap(async (req, res) => {
  const b = z.object({
    type: z.enum(['detective', 'battle', 'talk']),
    regionId: z.string().optional(),
    score: z.number().int().min(0).max(100000),
    correct: z.boolean().optional(),
    timeTaken: z.number().int().min(0).max(3600).optional(),
  }).parse(req.body)

  await tx(async c => {
    await c.query(
      'insert into attempts (user_id, type, region_id, score, correct, time_taken) values ($1,$2,$3,$4,$5,$6)',
      [req.user.id, b.type, b.regionId || null, b.score, b.correct ?? null, b.timeTaken ?? null])
    // 1 point per 10 score, capped per attempt so a forged score cannot inflate points
    await c.query(
      `update users set points = points + least($2, 100),
         best_score = case when $3 = 'detective' then greatest(best_score, $4) else best_score end
       where id = $1`, [req.user.id, Math.floor(b.score / 10), b.type, b.score])
    await touchActivity(req.user.id, c)
  })
  res.status(201).json({ ok: true })
}))

r.get('/leaderboard', wrap(async (_req, res) => {
  const { rows } = await q(
    `select name, home_region as region, best_score as "bestScore", streak, points
     from users where best_score > 0 order by best_score desc, points desc limit 10`)
  res.json({ leaderboard: rows })
}))

export default r
