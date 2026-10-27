import { Router } from 'express'
import { z } from 'zod'
import { PoolClient } from 'pg'
import { q, tx } from '../db'
import { HttpError, wrap } from '../middleware/errors'
import { requireAuth } from '../middleware/auth'
import { touchActivity } from '../lib/streak'

// Dialect Detective, timed on the SERVER so the clock cannot be paused or edited in the browser.
const LIMIT = 15  // seconds per question
const GRACE = 2   // network latency allowance
const r = Router()
r.use(requireAuth)

async function nextQuestion(c: PoolClient, sessionId: string) {
  const s = (await c.query('select used from quiz_sessions where id = $1', [sessionId])).rows[0]
  const e = (await c.query(
    `select e.id, e.kannada_script as kn, c.english_meaning as en, e.region_id as region
     from entries e join concepts c on c.id = e.concept_id
     where e.status = 'verified' and e.id <> all($1::text[]) order by random() limit 1`, [s.used])).rows[0]
  if (!e) return null // every verified word has been used this round: no repeats
  const others = (await c.query('select id from regions where id <> $1 order by random() limit 3', [e.region])).rows.map(x => x.id)
  const options = [e.region, ...others].sort(() => Math.random() - 0.5)
  await c.query(
    `update quiz_sessions set current_entry = $2, issued_at = now(), used = used || $2::text, answered = false where id = $1`,
    [sessionId, e.id])
  return { id: e.id, kn: e.kn, en: e.en, options, timeLimit: LIMIT }
}

r.post('/start', wrap(async (req, res) => {
  const out = await tx(async c => {
    const sid = (await c.query('insert into quiz_sessions (user_id) values ($1) returning id', [req.user.id])).rows[0].id
    return { sessionId: sid, question: await nextQuestion(c, sid) }
  })
  if (!out.question) return res.json({ done: true })
  res.json(out)
}))

r.post('/next', wrap(async (req, res) => {
  const { sessionId } = z.object({ sessionId: z.string().uuid() }).parse(req.body)
  const out = await tx(async c => {
    const s = (await c.query('select * from quiz_sessions where id = $1 and user_id = $2 for update', [sessionId, req.user.id])).rows[0]
    if (!s) throw new HttpError(404, 'Quiz session not found.')
    if (!s.answered) throw new HttpError(409, 'Answer the current question first.')
    return nextQuestion(c, sessionId)
  })
  if (!out) return res.json({ done: true })
  res.json({ sessionId, question: out })
}))

r.post('/answer', wrap(async (req, res) => {
  const b = z.object({ sessionId: z.string().uuid(), region: z.string().max(40).optional().default('') }).parse(req.body)
  const result = await tx(async c => {
    const s = (await c.query(
      `select s.*, extract(epoch from (now() - s.issued_at)) as elapsed, e.region_id as correct_region
       from quiz_sessions s left join entries e on e.id = s.current_entry
       where s.id = $1 and s.user_id = $2 for update of s`, [b.sessionId, req.user.id])).rows[0]
    if (!s) throw new HttpError(404, 'Quiz session not found.')
    if (s.answered) throw new HttpError(409, 'This question was already answered.')

    const elapsed = Number(s.elapsed)
    const correct = !!b.region && b.region === s.correct_region && elapsed <= LIMIT + GRACE
    const left = Math.max(0, Math.ceil(LIMIT - elapsed))
    const gained = correct ? 10 + left * 2 + s.streak * 5 : 0
    const score = s.score + gained
    const streak = correct ? s.streak + 1 : 0

    await c.query('update quiz_sessions set answered = true, score = $2, streak = $3 where id = $1', [s.id, score, streak])
    await c.query(
      'insert into attempts (user_id, type, region_id, score, correct, time_taken) values ($1,$2,$3,$4,$5,$6)',
      [req.user.id, 'detective', s.correct_region, gained, correct, Math.round(elapsed)])
    await c.query(
      'update users set best_score = greatest(best_score, $2), points = points + $3 where id = $1',
      [req.user.id, score, Math.floor(gained / 10)])
    if (correct) {
      await c.query('insert into user_stamps (user_id, stamp_id) select $1, id from stamps where id = $2 on conflict do nothing', [req.user.id, s.correct_region])
    }
    await touchActivity(req.user.id, c)
    return { correct, correctRegion: s.correct_region, gained, score, streak }
  })
  res.json(result)
}))

export default r
