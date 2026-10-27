import { Router } from 'express'
import { z } from 'zod'
import { q, tx } from '../db'
import { HttpError, wrap } from '../middleware/errors'
import { requireAuth } from '../middleware/auth'
import { publicUser } from '../lib/serialize'
import { touchActivity } from '../lib/streak'

const r = Router()
r.use(requireAuth)

r.get('/', wrap(async (req, res) => { res.json({ user: publicUser(req.user) }) }))

r.patch('/', wrap(async (req, res) => {
  const b = z.object({
    name: z.string().trim().min(1).max(80).optional(),
    region: z.string().optional(),
    district: z.string().optional(),
    uiLanguage: z.enum(['en', 'kn']).optional(),
  }).parse(req.body)
  const region = b.region ?? req.user.home_region
  const district = b.district ?? req.user.district
  if (b.region || b.district) {
    const ok = await q('select 1 from districts where name = $1 and region_id = $2', [district, region])
    if (!ok.rowCount) throw new HttpError(400, 'That district does not belong to the chosen region.')
  }
  const { rows } = await q(
    `update users set name = coalesce($2, name), home_region = $3, district = $4, ui_language = coalesce($5, ui_language)
     where id = $1 returning *`,
    [req.user.id, b.name, region, district, b.uiLanguage],
  )
  res.json({ user: publicUser(rows[0]) })
}))

// ---- Synced client state: explored regions, learned words, best score, points ----
const strArr = z.array(z.string().max(64)).max(1000)
const num = z.number().int().min(0).max(1_000_000)
const KEYS: Record<string, z.ZodTypeAny> = { explored: strArr, learned: strArr, best: num, points: num }

r.get('/state', wrap(async (req, res) => {
  const { rows } = await q('select key, value from user_state where user_id = $1', [req.user.id])
  const state: Record<string, any> = {}
  for (const row of rows) state[row.key] = row.value
  res.json({ state })
}))

r.put('/state/:key', wrap(async (req, res) => {
  const key = req.params.key
  const schema = KEYS[key]
  if (!schema) throw new HttpError(400, 'Unknown state key.')
  const value = schema.parse(req.body?.value)
  const uid = req.user.id

  await tx(async c => {
    await c.query(
      `insert into user_state (user_id, key, value) values ($1, $2, $3::jsonb)
       on conflict (user_id, key) do update set value = excluded.value, updated_at = now()`,
      [uid, key, JSON.stringify(value)],
    )
    // Mirror into the normalised tables so stamps, progress and leaderboards are queryable.
    if (key === 'explored') {
      await c.query(
        `insert into user_stamps (user_id, stamp_id) select $1, s.id from stamps s where s.id = any($2::text[])
         on conflict do nothing`, [uid, value])
    } else if (key === 'learned') {
      await c.query(
        `insert into progress (user_id, entry_id, learned) select $1, e.id, true from entries e where e.id = any($2::text[])
         on conflict (user_id, entry_id) do update set learned = true`, [uid, value])
    } else if (key === 'best') {
      await c.query('update users set best_score = greatest(best_score, $2) where id = $1', [uid, value])
    } else if (key === 'points') {
      await c.query('update users set points = greatest(points, $2) where id = $1', [uid, value])
    }
    await touchActivity(uid, c)
  })
  res.json({ ok: true })
}))

r.get('/stamps', wrap(async (req, res) => {
  const { rows } = await q(
    `select s.id, s.name, s.region_id as "regionId", us.earned_at as "earnedAt", (us.user_id is not null) as earned
     from stamps s left join user_stamps us on us.stamp_id = s.id and us.user_id = $1 order by s.name`, [req.user.id])
  res.json({ stamps: rows, unlocked: rows.filter(x => x.earned).length, total: rows.length })
}))

export default r
