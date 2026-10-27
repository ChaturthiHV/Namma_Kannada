import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { config } from './config'
import { errorHandler, notFound } from './middleware/errors'
import auth from './routes/auth'
import me from './routes/me'
import regions from './routes/regions'
import concepts from './routes/concepts'
import entries from './routes/entries'
import search from './routes/search'
import audio from './routes/audio'
import corrections from './routes/corrections'
import reports from './routes/reports'
import attempts from './routes/attempts'
import admin from './routes/admin'
import misc from './routes/misc'
import quiz from './routes/quiz'
import scenarios from './routes/scenarios'
import pronunciation from './routes/pronunciation'

export const app = express()
app.set('trust proxy', 1)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })) // audio files are loaded from another origin
app.use(cors({ origin: (origin, cb) => cb(null, !origin || config.clientOrigins.includes(origin)) }))
app.use(express.json({ limit: '100kb' }))
if (config.env !== 'test') app.use(morgan(config.env === 'production' ? 'combined' : 'dev'))

app.use('/uploads', express.static(config.uploadDir, { maxAge: '7d' }))

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: true, legacyHeaders: false }))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many attempts. Try again later.' } }))

app.use('/api/auth', auth)
app.use('/api/me', me)
app.use('/api/regions', regions)
app.use('/api/concepts', concepts)
app.use('/api/entries', entries)
app.use('/api/search', search)
app.use('/api/reports', reports)
app.use('/api/attempts', attempts)
app.use('/api/admin', admin)
app.use('/api/quiz', quiz)
app.use('/api/scenarios', scenarios)
app.use('/api/pronunciation', pronunciation)
app.use('/api', audio)        // /entries/:id/audio, /audio/:id
app.use('/api', corrections)  // /entries/:id/corrections, /corrections/:id
app.use('/api', misc)         // /health, /stats, /word-of-the-day, /export/dictionary

app.use(notFound)
app.use(errorHandler)
