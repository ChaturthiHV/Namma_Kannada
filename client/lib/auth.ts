'use client'
import { useEffect, useState } from 'react'
import { REGIONS } from './data'
import { DISTRICT_GEO } from './karnataka-geo'
import { API, api, setAuth, getToken, getApiUser, syncDown, clearSynced } from './api'

// Districts grouped by the six dialect areas (approximate: dialects are a continuum, not district-bound).
export const DISTRICTS: Record<string, string[]> = {
  north: ['Belagavi', 'Bagalkot', 'Vijayapura', 'Dharwad', 'Gadag', 'Haveri', 'Davanagere', 'Chitradurga'],
  hk: ['Kalaburagi', 'Bidar', 'Yadgir', 'Raichur', 'Koppal', 'Ballari', 'Vijayanagara'],
  mysuru: ['Mysuru', 'Mandya', 'Chamarajanagar', 'Hassan', 'Tumakuru', 'Ramanagara', 'Chikkaballapura', 'Kolar'],
  bengaluru: ['Bengaluru Urban', 'Bengaluru Rural'],
  coastal: ['Dakshina Kannada', 'Udupi', 'Uttara Kannada'],
  malnad: ['Shivamogga', 'Chikkamagaluru', 'Kodagu'],
}
// Find a user's dialect area even if the saved value is an id, a name, or missing (falls back to the district).
export function findRegion(region?: string, district?: string) {
  const v = (region || '').trim().toLowerCase()
  let r = REGIONS.find(x => x.id.toLowerCase() === v || x.n.toLowerCase() === v)
  if (!r && v) r = REGIONS.find(x => x.id.toLowerCase().startsWith(v) || v.startsWith(x.id.toLowerCase()))
  if (!r && district) {
    const d = district.trim().toLowerCase()
    const id = Object.keys(DISTRICTS).find(k => DISTRICTS[k].some(n => n.toLowerCase() === d))
    if (id) r = REGIONS.find(x => x.id === id)
  }
  return r
}
export type User = { name: string; phone: string; region: string; district: string }
type Stored = User & { hash: string }
const U = 'nk_users', S = 'nk_session'

export async function hashPw(phone: string, pw: string) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(phone + ':' + pw))
  return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('')
}
const users = (): Stored[] => { try { return JSON.parse(localStorage.getItem(U) || '[]') } catch { return [] } }
const strip = ({ hash, ...u }: Stored): User => u
const notify = () => window.dispatchEvent(new Event('nk:auth'))
// Server mode: talk to the API instead of localStorage
async function remote(path: string, body: any): Promise<string | null> {
  try {
    const { token, user } = await api(path, { method: 'POST', json: body })
    setAuth(token, user); await syncDown(); notify(); return null
  } catch (e: any) { return e.status ? e.message : 'Cannot reach the server. Please try again.' }
}

export function getSession(): User | null {
  if (API) { const u = getApiUser(); return u && getToken() ? { name: u.name, phone: u.phone, region: u.region, district: u.district } : null }
  try { const p = localStorage.getItem(S); const u = users().find(x => x.phone === p); return u ? strip(u) : null } catch { return null }
}
export async function register(d: User & { password: string }): Promise<string | null> {
  if (API) return remote('/auth/register', d)
  if (users().some(x => x.phone === d.phone)) return 'This phone number is already registered. Please log in.'
  const { password, ...u } = d
  localStorage.setItem(U, JSON.stringify([...users(), { ...u, hash: await hashPw(d.phone, password) }]))
  localStorage.setItem(S, d.phone); notify(); return null
}
export async function login(phone: string, pw: string): Promise<string | null> {
  if (API) return remote('/auth/login', { phone, password: pw })
  const u = users().find(x => x.phone === phone)
  if (!u || u.hash !== await hashPw(phone, pw)) return 'Phone number or password is incorrect.'
  localStorage.setItem(S, phone); notify(); return null
}
export async function requestOtp(phone: string): Promise<{ error?: string; devCode?: string }> {
  if (!API) return { error: 'Password reset needs the server (NEXT_PUBLIC_API_URL).' }
  try { const d = await api('/auth/otp/request', { method: 'POST', json: { phone } }); return { devCode: d.devCode } } catch (e: any) { return { error: e.status ? e.message : 'Cannot reach the server.' } }
}
export const resetPassword = (phone: string, code: string, password: string) => remote('/auth/reset-password', { phone, code, password })
export async function updateProfile(d: { name?: string; region?: string; district?: string }): Promise<string | null> {
  if (API) {
    try {
      const { user } = await api('/me', { method: 'PATCH', json: d })
      const token = getToken()
      if (token && user) setAuth(token, user)
      notify()
      return null
    } catch (e: any) { return e.status ? e.message : 'Cannot reach the server. Please try again.' }
  }
  try {
    const p = localStorage.getItem(S)
    if (!p) return 'Not logged in'
    const list = users()
    const idx = list.findIndex(x => x.phone === p)
    if (idx === -1) return 'User not found'
    list[idx] = { ...list[idx], ...d }
    localStorage.setItem(U, JSON.stringify(list))
    notify()
    return null
  } catch { return 'Failed to save changes.' }
}
export function logout() { if (API) { setAuth(null); clearSynced() } else localStorage.removeItem(S); notify() }
export function useUser() {
  const [u, s] = useState<User | null>(null)
  useEffect(() => { const r = () => s(getSession()); r(); window.addEventListener('nk:auth', r); return () => window.removeEventListener('nk:auth', r) }, [])
  return u
}
// Map pin position: centre of the dialect area, nudged per district so each district sits at its own spot.
export function pinFor(region: string, district: string): [number, number] {
  const g = DISTRICT_GEO[district === 'Vijayanagara' ? 'Ballari' : district]
  if (g) return g.c
  const r = REGIONS.find(x => x.id === region); if (!r) return [90, 140]
  const n = (r.p.match(/-?\d+(\.\d+)?/g) || []).map(Number); let x = 0, y = 0, c = 0
  for (let i = 0; i + 1 < n.length; i += 2) { x += n[i]; y += n[i + 1]; c++ }
  return [x / c, y / c]
}
