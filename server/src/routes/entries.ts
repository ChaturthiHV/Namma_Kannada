import { Router } from 'express'
import { randomBytes } from 'crypto'
import { z } from 'zod'
import { q, tx } from '../db'
import { HttpError, wrap } from '../middleware/errors'
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth'
import { ENTRY_SELECT, VOTES_NEEDED } from '../lib/serialize'
import { searchEntries } from '../lib/search'
import { isDisrespectful } from '../lib/moderation'
import { touchActivity } from '../lib/streak'

const r = Router()

const STATUSES = ['pending', 'verified', 'disputed', 'rejected'] as const

// ---- List / filter / fuzzy search -------------------------------------------------
r.get('/', optionalAuth, wrap(async (req, res) => {
  const { region, concept, status, q: term } = req.query as Record<string, string>
  const isReviewer = req.user && ['reviewer', 'admin'].includes(req.user.role)

  if (term) {
    const rows = await searchEntries(term, { region })
    return res.json({ entries: rows })
  }
  const where: string[] = []
  const params: any[] = []
  if (region) { params.push(region); where.push(`e.region_id = $${params.length}`) }
  if (concept) { params.push(concept); where.push(`e.concept_id = $${params.length}`) }
  if (status && (STATUSES as readonly string[]).includes(status)) {
    // Rejected entries are only visible to reviewers
    if (status === 'rejected' && !isReviewer) throw new HttpError(403, 'Only reviewers can list rejected entries.')
    params.push(status); where.push(`e.status = $${params.length}`)
  } else {
    where.push(`e.status <> 'rejected'`)
  }
  const { rows } = await q(`${ENTRY_SELECT} ${where.length ? 'where ' + where.join(' and ') : ''} order by e.seq`, params)
  if (req.user) {
    const mine = new Set((await q('select entry_id from entry_votes where user_id = $1', [req.user.id])).rows.map((v: any) => v.entry_id))
    rows.forEach((e: any) => { e.voted = mine.has(e.id) })
  }
  res.json({ entries: rows })
}))

r.get('/:id', wrap(async (req, res) => {
  const { rows } = await q(`${ENTRY_SELECT} where e.id = $1`, [req.params.id])
  if (!rows[0]) throw new HttpError(404, 'Entry not found.')
  const variants = await q('select variant from spelling_variants where entry_id = $1', [req.params.id])
  res.json({ entry: rows[0], variants: variants.rows.map(v => v.variant) })
}))


// ---- Contribute a word ------------------------------------------------------------
const createSchema = z.object({
  kn: z.string().trim().min(1, 'Kannada word is required.').max(200),
  en: z.string().trim().min(1, 'Meaning is required.').max(200),
  region: z.string().min(1),
  rom: z.string().trim().max(200).optional().default(''),
  ctx: z.string().trim().max(300).optional(),
  example: z.string().trim().max(500).optional(),
  exampleTranslation: z.string().trim().max(500).optional(),
  ipa: z.string().trim().max(200).optional(),
})

r.post('/', requireAuth, wrap(async (req, res) => {
  const b = createSchema.parse(req.body)
  if (isDisrespectful(b.kn, b.en, b.rom, b.ctx, b.example)) throw new HttpError(400, 'Please keep it respectful.')

  const entry = await tx(async c => {
    // Find or create the concept ("meaning layer") by its English meaning
    let concept = (await c.query('select id from concepts where lower(english_meaning) = lower($1)', [b.en])).rows[0]
    if (!concept) {
      const id = 'c' + randomBytes(5).toString('hex')
      concept = (await c.query('insert into concepts (id, english_meaning) values ($1,$2) returning id', [id, b.en])).rows[0]
    }
    // Idempotent: the exact same word for the same meaning and region returns the existing entry
    const dup = (await c.query(
      `select id from entries where concept_id = $1 and region_id = $2 and kannada_script = $3 and status <> 'rejected'`,
      [concept.id, b.region, b.kn])).rows[0]
    if (dup) return dup.id

    const id = 'u' + randomBytes(5).toString('hex')
    await c.query(
      `insert into entries (id, concept_id, region_id, kannada_script, romanized, ipa, context_tag, example_sentence, example_translation, status, submitted_by)
       values ($1,$2,$3,$4,$5,$6,coalesce($7,'Community'),$8,$9,'pending',$10)`,
      [id, concept.id, b.region, b.kn, b.rom, b.ipa, b.ctx, b.example, b.exampleTranslation, req.user.id])
    await touchActivity(req.user.id, c)
    return id
  })
  const { rows } = await q(`${ENTRY_SELECT} where e.id = $1`, [entry])
  res.status(201).json({ entry: rows[0] })
}))

// ---- Community verification: 10 speakers of the same dialect must approve ----------
r.post('/:id/vote', requireAuth, wrap(async (req, res) => {
  const id = req.params.id
  await tx(async c => {
    const cur = (await c.query('select id, status, region_id, submitted_by from entries where id = $1 for update', [id])).rows[0]
    if (!cur) throw new HttpError(404, 'Entry not found.')
    if (cur.status !== 'pending') throw new HttpError(409, 'This entry is no longer waiting for approval.')
    // The voter's dialect: their saved region, or the region of their district if none was saved.
    const myRegion = req.user.home_region
      || (await c.query('select region_id from districts where lower(name) = lower($1)', [req.user.district || ''])).rows[0]?.region_id
    if (!myRegion || myRegion !== cur.region_id)
      throw new HttpError(403, 'Only speakers of this dialect can approve it.')
    if (cur.submitted_by && cur.submitted_by === req.user.id) throw new HttpError(403, "You can't approve your own contribution.")

    const ins = await c.query('insert into entry_votes (entry_id, user_id) values ($1,$2) on conflict do nothing', [id, req.user.id])
    if (!ins.rowCount) throw new HttpError(409, 'You have already approved this entry.')

    const n = (await c.query('select count(*)::int as n from entry_votes where entry_id = $1', [id])).rows[0].n
    if (n >= VOTES_NEEDED) {
      await c.query(
        `insert into entry_versions (entry_id, version, snapshot, edited_by)
         select e.id, e.version, to_jsonb(e), null from entries e where e.id = $1`, [id])
      await c.query("update entries set status = 'verified', version = version + 1, updated_at = now() where id = $1", [id])
      await c.query(
        'insert into moderation_log (entry_id, reviewer_id, from_status, to_status, note) values ($1,null,$2,$3,$4)',
        [id, 'pending', 'verified', `Approved by ${VOTES_NEEDED} speakers of the same dialect`])
      if (cur.submitted_by) await c.query('update users set points = points + 10 where id = $1', [cur.submitted_by])
    }
  })
  const { rows } = await q(`${ENTRY_SELECT} where e.id = $1`, [id])
  res.json({ entry: { ...rows[0], voted: true }, votesNeeded: VOTES_NEEDED })
}))

// ---- Moderation: approve / reject / dispute ---------------------------------------
r.patch('/:id/status', ...requireRole('reviewer', 'admin'), wrap(async (req, res) => {
  const b = z.object({ status: z.enum(STATUSES), note: z.string().max(500).optional() }).parse(req.body)
  const id = req.params.id

  await tx(async c => {
    const cur = (await c.query('select id, status, submitted_by from entries where id = $1 for update', [id])).rows[0]
    if (!cur) throw new HttpError(404, 'Entry not found.')
    if (cur.status === b.status) return

    await c.query(
      `insert into entry_versions (entry_id, version, snapshot, edited_by)
       select e.id, e.version, to_jsonb(e), $2 from entries e where e.id = $1`, [id, req.user.id])
    await c.query('update entries set status = $2, version = version + 1, updated_at = now() where id = $1', [id, b.status])
    await c.query(
      'insert into moderation_log (entry_id, reviewer_id, from_status, to_status, note) values ($1,$2,$3,$4,$5)',
      [id, req.user.id, cur.status, b.status, b.note])
    // Contributor credit when a submission is verified for the first time
    if (b.status === 'verified' && cur.status !== 'verified' && cur.submitted_by) {
      await c.query('update users set points = points + 10 where id = $1', [cur.submitted_by])
    }
  })
  const { rows } = await q(`${ENTRY_SELECT} where e.id = $1`, [id])
  res.json({ entry: rows[0] })
}))

// ---- Version history & rollback ---------------------------------------------------
r.get('/:id/versions', ...requireRole('reviewer', 'admin'), wrap(async (req, res) => {
  const { rows } = await q(
    `select v.version, v.snapshot, v.created_at as "createdAt", u.name as "editedBy"
     from entry_versions v left join users u on u.id = v.edited_by where v.entry_id = $1 order by v.version desc`, [req.params.id])
  res.json({ versions: rows })
}))

r.post('/:id/rollback', ...requireRole('reviewer', 'admin'), wrap(async (req, res) => {
  const { version } = z.object({ version: z.number().int().positive() }).parse(req.body)
  await tx(async c => {
    const snap = (await c.query('select snapshot from entry_versions where entry_id = $1 and version = $2', [req.params.id, version])).rows[0]
    if (!snap) throw new HttpError(404, 'Version not found.')
    const s = snap.snapshot
    await c.query(
      `insert into entry_versions (entry_id, version, snapshot, edited_by)
       select e.id, e.version, to_jsonb(e), $2 from entries e where e.id = $1`, [req.params.id, req.user.id])
    await c.query(
      `update entries set kannada_script = $2, romanized = $3, ipa = $4, literal_meaning = $5, context_tag = $6,
         example_sentence = $7, example_translation = $8, status = $9, version = version + 1, updated_at = now()
       where id = $1`,
      [req.params.id, s.kannada_script, s.romanized, s.ipa, s.literal_meaning, s.context_tag, s.example_sentence, s.example_translation, s.status])
  })
  const { rows } = await q(`${ENTRY_SELECT} where e.id = $1`, [req.params.id])
  res.json({ entry: rows[0] })
}))


export default r
