import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ZodError } from 'zod'
import multer from 'multer'

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

/** Express 4 does not catch rejected promises: wrap async handlers with this. */
export const wrap = (fn: (req: Request, res: Response, next: NextFunction) => any): RequestHandler =>
  (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next) }

export const notFound: RequestHandler = (_req, res) => { res.status(404).json({ error: 'Not found' }) }

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    const first = err.issues[0]
    return res.status(400).json({ error: first ? `${first.path.join('.') || 'body'}: ${first.message}` : 'Invalid input', issues: err.issues })
  }
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message })
  if (err instanceof multer.MulterError) {
    return res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'Audio file is too large.' : err.message })
  }
  if (err?.code === '23505') return res.status(409).json({ error: 'That already exists.' })
  if (err?.code === '23503') return res.status(400).json({ error: 'Referenced record does not exist.' })
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON.' })
  console.error(err)
  res.status(500).json({ error: 'Something went wrong on our side.' })
}
