import { Router } from 'express'
import multer from 'multer'
import rateLimit from 'express-rate-limit'
import { config } from '../config'
import { q } from '../db'
import { HttpError, wrap } from '../middleware/errors'
import { requireAuth } from '../middleware/auth'
import { asrAvailable, similarity, transcribe } from '../lib/asr'

const r = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: config.maxAudioMb * 1024 * 1024, files: 1 } })

// Tell the client whether automatic scoring is switched on
r.get('/status', (_req, res) => { res.json({ available: asrAvailable() }) })

// multipart: audio (file), entryId. Audio is NOT stored: it is scored and discarded.
r.post('/score', requireAuth, rateLimit({ windowMs: 60_000, limit: 15, standardHeaders: true, legacyHeaders: false }),
  upload.single('audio'), wrap(async (req, res) => {
    if (!asrAvailable()) return res.json({ available: false })
    if (!req.file) throw new HttpError(400, 'No audio file received.')
    const e = (await q('select kannada_script from entries where id = $1', [req.body.entryId])).rows[0]
    if (!e) throw new HttpError(404, 'Entry not found.')
    try {
      const transcript = await transcribe(req.file.buffer, (req.file.mimetype || 'audio/webm').split(';')[0])
      res.json({ available: true, score: similarity(transcript, e.kannada_script), transcript, approximate: true })
    } catch (err) {
      console.error('ASR failed:', err)
      res.json({ available: false }) // client falls back to self-rating
    }
  }))

export default r
