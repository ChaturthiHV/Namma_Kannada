import { config } from '../config'

/** Sends an SMS through a webhook you control. With no webhook configured it just logs (dev). */
export async function sendSms(phone: string, message: string) {
  if (!config.sms.url) { console.log(`[sms:dev] to ${phone}: ${message}`); return }
  const r = await fetch(config.sms.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(config.sms.token ? { Authorization: 'Bearer ' + config.sms.token } : {}) },
    body: JSON.stringify({ to: phone, message }),
    signal: AbortSignal.timeout(10000),
  })
  if (!r.ok) throw new Error('SMS provider returned ' + r.status)
}
