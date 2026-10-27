import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { q } from '../db'
import { HttpError, wrap } from '../middleware/errors'
import { requireAuth, signToken } from '../middleware/auth'
import { publicUser } from '../lib/serialize'
import { touchActivity } from '../lib/streak'
import { createHmac, randomInt, timingSafeEqual } from 'crypto'
import { config } from '../config'
import { sendSms } from '../lib/sms'

const r = Router()

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(80),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number.'),
  password: z.string().min(6, 'Password must be at least 6 characters.').max(72),
  region: z.string().min(1, 'Choose which Kannada you speak.'),
  district: z.string().min(1, 'Choose your district.'),
})

r.post('/register', wrap(async (req, res) => {
  const b = registerSchema.parse(req.body)
  const ok = await q('select 1 from districts where name = $1 and region_id = $2', [b.district, b.region])
  if (!ok.rowCount) throw new HttpError(400, 'That district does not belong to the chosen region.')
  const exists = await q('select 1 from users where phone = $1', [b.phone])
  if (exists.rowCount) throw new HttpError(409, 'This phone number is already registered. Please log in.')

  const hash = await bcrypt.hash(b.password, 10)
  const { rows } = await q(
    `insert into users (name, phone, password_hash, home_region, district, role)
     values ($1,$2,$3,$4,$5,'contributor') returning *`,
    [b.name, b.phone, hash, b.region, b.district],
  )
  await touchActivity(rows[0].id)
  const user = (await q('select * from users where id = $1', [rows[0].id])).rows[0]
  res.status(201).json({ token: signToken(user), user: publicUser(user) })
}))

r.post('/login', wrap(async (req, res) => {
  const b = z.object({ phone: z.string(), password: z.string() }).parse(req.body)
  const { rows } = await q('select * from users where phone = $1', [b.phone])
  const u = rows[0]
  // Same message for unknown phone and wrong password: do not reveal which accounts exist.
  if (!u || !(await bcrypt.compare(b.password, u.password_hash))) throw new HttpError(401, 'Phone number or password is incorrect.')
  await touchActivity(u.id)
  const fresh = (await q('select * from users where id = $1', [u.id])).rows[0]
  res.json({ token: signToken(fresh), user: publicUser(fresh) })
}))

// ---- OTP: password reset and passwordless login ------------------------------------
const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number.')
const hashCode = (phone: string, code: string) => createHmac('sha256', config.jwtSecret).update(phone + ':' + code).digest('hex')

async function checkOtp(phone: string, code: string) {
  const row = (await q('select * from otp_codes where phone = $1', [phone])).rows[0]
  const bad = () => new HttpError(400, 'Invalid or expired code.')
  if (!row || row.expires_at < new Date()) throw bad()
  if (row.attempts >= 5) throw new HttpError(429, 'Too many wrong codes. Request a new one.')
  const a = Buffer.from(hashCode(phone, code)), b = Buffer.from(row.code_hash)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    await q('update otp_codes set attempts = attempts + 1 where phone = $1', [phone])
    throw bad()
  }
  await q('delete from otp_codes where phone = $1', [phone]) // single use
}

r.post('/otp/request', wrap(async (req, res) => {
  const { phone } = z.object({ phone: phoneSchema }).parse(req.body)
  const user = (await q('select 1 from users where phone = $1', [phone])).rowCount
  const code = String(randomInt(100000, 1000000))
  if (user) {
    await q(
      `insert into otp_codes (phone, code_hash, expires_at) values ($1,$2, now() + interval '10 minutes')
       on conflict (phone) do update set code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0, created_at = now()`,
      [phone, hashCode(phone, code)])
    await sendSms(phone, `Your Namma Kannada code is ${code}. It expires in 10 minutes.`)
  }
  // Same answer whether or not the number is registered (no account enumeration)
  res.json({ ok: true, ...(config.otpDevEcho && user ? { devCode: code } : {}) })
}))

r.post('/otp/login', wrap(async (req, res) => {
  const b = z.object({ phone: phoneSchema, code: z.string().length(6) }).parse(req.body)
  await checkOtp(b.phone, b.code)
  const u = (await q('select * from users where phone = $1', [b.phone])).rows[0]
  if (!u) throw new HttpError(400, 'Invalid or expired code.')
  await touchActivity(u.id)
  const fresh = (await q('select * from users where id = $1', [u.id])).rows[0]
  res.json({ token: signToken(fresh), user: publicUser(fresh) })
}))

r.post('/reset-password', wrap(async (req, res) => {
  const b = z.object({ phone: phoneSchema, code: z.string().length(6), password: z.string().min(6, 'Password must be at least 6 characters.').max(72) }).parse(req.body)
  await checkOtp(b.phone, b.code)
  const hash = await bcrypt.hash(b.password, 10)
  const u = (await q('update users set password_hash = $2 where phone = $1 returning *', [b.phone, hash])).rows[0]
  if (!u) throw new HttpError(400, 'Invalid or expired code.')
  res.json({ token: signToken(u), user: publicUser(u) })
}))

r.get('/me', requireAuth, wrap(async (req, res) => { res.json({ user: publicUser(req.user) }) }))

export default r
