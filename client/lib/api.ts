// Thin client for the Namma Kannada server (../server).
// When NEXT_PUBLIC_API_URL is empty, API is null and the app runs in demo mode (localStorage only).
export const API: string | null = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '') : null

const TOKEN = 'nk_token', USER = 'nk_user'
export const SYNC_KEYS = ['explored', 'learned', 'best', 'points']

export const getToken = (): string | null => { try { return localStorage.getItem(TOKEN) } catch { return null } }
export const setAuth = (token: string | null, user?: any) => {
  try {
    if (token) { localStorage.setItem(TOKEN, token); localStorage.setItem(USER, JSON.stringify(user)) }
    else { localStorage.removeItem(TOKEN); localStorage.removeItem(USER) }
  } catch {}
}
export const getApiUser = () => { try { return JSON.parse(localStorage.getItem(USER) || 'null') } catch { return null } }

export async function api<R = any>(path: string, init: RequestInit & { json?: any } = {}): Promise<R> {
  if (!API) throw new Error('API disabled')
  const { json, ...rest } = init
  const headers: Record<string, string> = { ...((rest.headers as any) || {}) }
  const t = getToken(); if (t) headers.Authorization = 'Bearer ' + t
  if (json !== undefined) headers['Content-Type'] = 'application/json'
  const r = await fetch(API + '/api' + path, { ...rest, headers, body: json !== undefined ? JSON.stringify(json) : rest.body })
  const d = await r.json().catch(() => null)
  if (!r.ok) throw Object.assign(new Error(d?.error || 'Request failed'), { status: r.status })
  return d
}

/** After login: pull saved progress from the server into the keys the pages already read. */
export async function syncDown() {
  try {
    const { state } = await api('/me/state')
    for (const k of SYNC_KEYS) {
      if (state[k] !== undefined) { localStorage.setItem(k, JSON.stringify(state[k])); window.dispatchEvent(new Event('ls:' + k)) }
    }
  } catch {}
}

/** Debounced push of one progress key to the server. */
const timers: Record<string, any> = {}
export function pushState(key: string, value: any) {
  if (!API || !getToken() || !SYNC_KEYS.includes(key)) return
  clearTimeout(timers[key])
  timers[key] = setTimeout(() => { api(`/me/state/${key}`, { method: 'PUT', json: { value } }).catch(() => {}) }, 600)
}

/** On logout: clear synced keys so the next person on this device starts clean. */
export function clearSynced() {
  try { for (const k of SYNC_KEYS) { localStorage.removeItem(k); window.dispatchEvent(new Event('ls:' + k)) } } catch {}
}
