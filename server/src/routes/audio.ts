import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import multer from 'multer'
import { config } from '../config'
import { q } from '../db'
import { HttpError, wrap } from '../middleware/errors'
import { requireAuth } from '../middleware/auth'
import { publicAudio } from '../lib/serialize'
import { touchActivity } from '../lib/streak'

const r = Router()

const EXT: Record<string, string> = {
  'audio/webm': '.webm', 'audio/ogg': '.ogg', 'audio/mpeg': '.mp3', 'audio/mp4': '.m4a',
  'audio/wav': '.wav', 'audio/x-wav': '.wav',
}
const baseMime = (m: string) => (m || '').split(';')[0].trim().toLowerCase() // browsers send "audio/webm;codecs=opus"

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => { fs.mkdirSync(config.uploadDir, { recursive: true }); cb(null, config.uploadDir) },
    filename: (_req, file, cb) => cb(null, randomUUID() + EXT[baseMime(file.mimetype)]),
  }),
  limits: { fileSize: config.maxAudioMb * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => (EXT[baseMime(file.mimetype)] ? cb(null, true) : cb(new HttpError(415, 'Unsupported audio format. Use webm, ogg, mp3, m4a or wav.') as any)),
})

const rm = (file?: string) => { if (file) fs.unlink(path.join(config.uploadDir, file), () => {}) }

r.get('/entries/:id/audio', wrap(async (req, res) => {
  const { rows } = await q('select * from audio where entry_id = $1 order by created_at', [req.params.id])
  res.json({ audio: rows.map(publicAudio) })
}))

// multipart/form-data: audio (file), consent="true", duration?, ageGroup?, gender?, locality?
r.post('/entries/:id/audio', requireAuth, upload.single('audio'), wrap(async (req, res) => {
  const file = req.file
  if (!file) throw new HttpError(400, 'No audio file received.')
  try {
    if (req.body.consent !== 'true') throw new HttpError(400, 'Consent is required to share a voice recording.')
    const entry = await q('select 1 from entries where id = $1', [req.params.id])
    if (!entry.rowCount) throw new HttpError(404, 'Entry not found.')
    const dur = Math.min(Math.max(parseInt(req.body.duration) || 0, 0), 120)
    const meta = { ageGroup: req.body.ageGroup, gender: req.body.gender, locality: req.body.locality }
    const { rows } = await q(
      `insert into audio (entry_id, speaker_id, url, file_name, mime_type, duration, consent_flag, speaker_meta)
       values ($1,$2,$3,$4,$5,$6,true,$7::jsonb) returning *`,
      [req.params.id, req.user.id, '/uploads/' + file.filename, file.filename, baseMime(file.mimetype), dur || null, JSON.stringify(meta)])
    await touchActivity(req.user.id)
    res.status(201).json({ audio: publicAudio(rows[0]) })
  } catch (e) { rm(file.filename); throw e }
}))

// "Delete my recording": owner or admin
r.delete('/audio/:id', requireAuth, wrap(async (req, res) => {
  const a = (await q('select * from audio where id = $1', [req.params.id])).rows[0]
  if (!a) throw new HttpError(404, 'Recording not found.')
  if (a.speaker_id !== req.user.id && req.user.role !== 'admin') throw new HttpError(403, 'You can only delete your own recordings.')
  await q('delete from audio where id = $1', [a.id])
  rm(a.file_name)
  res.json({ ok: true })
}))

export default r
