import { q } from '../db'
import { ENTRY_COLS, ENTRY_FROM } from './serialize'

const esc = (s: string) => s.replace(/[\\%_]/g, m => '\\' + m)

/**
 * Smart search: substring match on Kannada script / romanized / English / spelling variants,
 * plus pg_trgm fuzzy matching so "hogtidiya" and "hogthidiya" find the same entry.
 */
export async function searchEntries(term: string, opts: { type?: string; region?: string; limit?: number } = {}) {
  const t = term.trim().slice(0, 100)
  if (!t) return []
  const like = '%' + esc(t) + '%'
  const params: any[] = [like, t]
  const where = [`e.status <> 'rejected'`]

  if (opts.type === 'words') where.push(`e.kannada_script !~ '[[:space:]]'`)
  if (opts.type === 'phrases') where.push(`e.kannada_script ~ '[[:space:]]'`)
  if (opts.region) { params.push(opts.region); where.push(`e.region_id = $${params.length}`) }

  const score = `greatest(
      similarity(e.kannada_script, $2),
      similarity(lower(coalesce(e.romanized, '')), lower($2)),
      similarity(lower(c.english_meaning), lower($2)),
      coalesce((select max(similarity(lower(v.variant), lower($2))) from spelling_variants v where v.entry_id = e.id), 0))`

  params.push(Math.min(opts.limit || 50, 100))
  const { rows } = await q(
    `select ${ENTRY_COLS}, ${score} as score ${ENTRY_FROM}
     where ${where.join(' and ')} and (
       e.kannada_script ilike $1 or e.romanized ilike $1 or c.english_meaning ilike $1
       or exists (select 1 from spelling_variants v where v.entry_id = e.id and v.variant ilike $1)
       or ${score} > 0.3)
     order by score desc, e.seq
     limit $${params.length}`,
    params,
  )
  return rows
}
