// End-to-end check against a running API:  npm run smoke   (API_URL defaults to http://localhost:4000)
const API = (process.env.API_URL || 'http://localhost:4000') + '/api'
const ADMIN = { phone: process.env.ADMIN_PHONE || '9999999999', password: process.env.ADMIN_PASSWORD || 'admin123' }
const call = async (path, { token, body, method } = {}) => {
  const r = await fetch(API + path, {
    method: method || (body ? 'POST' : 'GET'),
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: r.status, data: await r.json().catch(() => null) }
}
const ok = (name, cond) => { console.log((cond ? 'PASS ' : 'FAIL ') + name); if (!cond) process.exitCode = 1 }

const phone = '9' + String(Date.now()).slice(-9)
let r = await call('/health'); ok('health', r.status === 200)
r = await call('/regions'); ok('regions', r.data.regions.length >= 6)
r = await call('/auth/register', { body: { name: 'Smoke Test', phone, password: 'secret1', region: 'mysuru', district: 'Mysuru' } })
ok('register', r.status === 201 && !!r.data.token); const user = r.data.token
r = await call('/entries', { token: user, body: { kn: 'ಪರೀಕ್ಷೆ', en: 'Smoke test word', region: 'mysuru', rom: 'pareekshe' } })
ok('contribute (pending)', r.status === 201 && r.data.entry.status === 'pending'); const id = r.data.entry.id
r = await call(`/entries/${id}/status`, { token: user, method: 'PATCH', body: { status: 'verified' } })
ok('normal user cannot moderate (403)', r.status === 403)
r = await call('/auth/login', { body: ADMIN }); ok('admin login', r.status === 200); const admin = r.data.token
r = await call(`/entries/${id}/status`, { token: admin, method: 'PATCH', body: { status: 'verified' } })
ok('admin approves', r.status === 200 && r.data.entry.status === 'verified')
r = await call('/search?q=pareeksha'); ok('fuzzy search finds it', r.data.entries.some(e => e.id === id))
r = await call('/me/state/explored', { token: user, method: 'PUT', body: { value: ['mysuru'] } }); ok('save progress', r.status === 200)
r = await call('/me/stamps', { token: user }); ok('stamp earned', r.data.unlocked === 1)
r = await call('/stats'); ok('stats', r.data.words > 0)
r = await call('/scenarios'); ok('scenarios', Object.keys(r.data.scenarios).length === 4)
r = await call('/quiz/start', { token: user, body: {} }); ok('quiz start', !!r.data.sessionId && r.data.question.options.length === 4)
const sid = r.data.sessionId
r = await call('/quiz/answer', { token: user, body: { sessionId: sid, region: r.data.question.options[0] } }); ok('quiz answer is scored by server', typeof r.data.correct === 'boolean')
r = await call('/auth/otp/request', { body: { phone } }); ok('otp request', r.status === 200)
if (r.data.devCode) {
  r = await call('/auth/reset-password', { body: { phone, code: r.data.devCode, password: 'newsecret1' } }); ok('reset password with OTP', r.status === 200)
  r = await call('/auth/login', { body: { phone, password: 'newsecret1' } }); ok('login with new password', r.status === 200)
}
r = await call('/pronunciation/status'); ok('pronunciation status', typeof r.data.available === 'boolean')
