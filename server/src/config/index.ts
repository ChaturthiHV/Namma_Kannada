import 'dotenv/config'
import path from 'path'

const env = process.env

export const config = {
  env: env.NODE_ENV || 'development',
  port: Number(env.PORT || 4000),
  databaseUrl: env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/namma_kannada',
  dbSsl: env.DATABASE_SSL === 'true',
  jwtSecret: env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpires: env.JWT_EXPIRES_IN || '7d',
  clientOrigins: (env.CLIENT_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim()).filter(Boolean),
  uploadDir: path.resolve(env.UPLOAD_DIR || 'uploads'),
  maxAudioMb: Number(env.MAX_AUDIO_MB || 3),
  publicUrl: (env.PUBLIC_URL || '').replace(/\/$/, ''),
  timezone: env.APP_TIMEZONE || 'Asia/Kolkata',
  asr: { url: env.ASR_URL || '', model: env.ASR_MODEL || 'whisper-1', key: env.ASR_API_KEY || '' },
  sms: { url: env.SMS_WEBHOOK_URL || '', token: env.SMS_WEBHOOK_TOKEN || '' },
  otpDevEcho: env.OTP_DEV_ECHO === 'true' && (env.NODE_ENV || 'development') !== 'production',
  admin: { phone: env.ADMIN_PHONE, password: env.ADMIN_PASSWORD, name: env.ADMIN_NAME || 'Admin' },
}

if (config.env === 'production' && config.jwtSecret === 'dev-secret-change-me') {
  throw new Error('JWT_SECRET must be set to a strong random value in production.')
}
