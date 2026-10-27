import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { q } from '../db'
import { HttpError, wrap } from './errors'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express { interface Request { user?: any } }
}

export type Role = 'learner' | 'contributor' | 'reviewer' | 'admin'

export const signToken = (u: { id: string; role: string }) =>
  jwt.sign({ sub: u.id, role: u.role }, config.jwtSecret, { expiresIn: config.jwtExpires as any })

async function load(req: Request) {
  const h = req.headers.authorization
  if (!h || !h.startsWith('Bearer ')) return null
  try {
    const p: any = jwt.verify(h.slice(7), config.jwtSecret)
    // Look the user up every time so role changes and deletions take effect immediately.
    const { rows } = await q('select * from users where id = $1', [p.sub])
    return rows[0] || null
  } catch { return null }
}

/** Attaches req.user when a valid token is present, never rejects. */
export const optionalAuth = wrap(async (req, _res, next) => { req.user = (await load(req)) || undefined; next() })

export const requireAuth = wrap(async (req, _res, next) => {
  const u = await load(req)
  if (!u) throw new HttpError(401, 'Please log in.')
  req.user = u; next()
})

export const requireRole = (...roles: Role[]) => [
  requireAuth,
  (req: Request, _res: Response, next: NextFunction) =>
    roles.includes(req.user.role) ? next() : next(new HttpError(403, 'You do not have permission to do that.')),
]
