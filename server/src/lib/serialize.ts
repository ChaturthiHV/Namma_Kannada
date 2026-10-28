import { config } from '../config'

/**
 * Entry rows are returned in the exact shape the frontend already uses:
 *   { id, concept, en, region, kn, rom, status, ctx }
 * plus a few extras (ipa, example, version, audioCount ...).
 */
export const ENTRY_COLS = `
  e.id, e.concept_id as concept, c.english_meaning as en, e.region_id as region,
  e.kannada_script as kn, coalesce(e.romanized, '') as rom, e.status,
  coalesce(e.context_tag, 'Everyday') as ctx, e.ipa,
  e.literal_meaning as "literalMeaning", e.example_sentence as example,
  e.example_translation as "exampleTranslation", e.version,
  e.submitted_by as "submittedBy", e.created_at as "createdAt",
  (select count(*)::int from audio a where a.entry_id = e.id) as "audioCount",
  (select count(*)::int from entry_votes v where v.entry_id = e.id) as votes`
/** Approvals from speakers of the same dialect needed before a contribution is shown as verified. */
export const VOTES_NEEDED = 10

export const ENTRY_FROM = `from entries e join concepts c on c.id = e.concept_id`
export const ENTRY_SELECT = `select ${ENTRY_COLS} ${ENTRY_FROM}`

export const publicUser = (u: any) => ({
  id: u.id, name: u.name, phone: u.phone, region: u.home_region, district: u.district,
  role: u.role, points: u.points, streak: u.streak, bestScore: u.best_score, streakFreezes: u.streak_freezes, uiLanguage: u.ui_language,
})

export const audioUrl = (url: string) => (/^https?:/.test(url) ? url : config.publicUrl + url)
export const publicAudio = (a: any) => ({
  id: a.id, entryId: a.entry_id, url: audioUrl(a.url), duration: a.duration,
  speakerMeta: a.speaker_meta || {}, createdAt: a.created_at,
})
