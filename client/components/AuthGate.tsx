'use client'
import { useEffect, useState } from 'react'
import { Phone, Lock, User as UserIcon } from 'lucide-react'
import { REGIONS } from '@/lib/data'
import { DISTRICTS, getSession, login, register, requestOtp, resetPassword } from '@/lib/auth'
import { API } from '@/lib/api'
import RegionMap from './RegionMap'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import SwRegister from './SwRegister'

const inp = 'w-full rounded-xl border border-border bg-surface2 py-2.5 pl-10 pr-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary'
const Field = ({ icon: I, ...p }: any) => <label className="relative block"><I size={16} className="absolute left-3 top-3 text-muted" /><input {...p} className={inp} /></label>

export default function AuthGate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="safe-t min-w-0 flex-1 pb-28 md:pb-0">{children}</main>
      </div>
      <MobileNav />
      <SwRegister />
    </>
  )
}

export function AuthScreen({ onSuccess, compact = false }: { onSuccess?: () => void; compact?: boolean }) {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login'), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const [f, setF] = useState({ name: '', phone: '', region: '', district: '', password: '', confirm: '' })
  const set = (k: string, v: string) => { setErr(''); setF(p => ({ ...p, [k]: v, ...(k === 'region' ? { district: '' } : {}) })) }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[6-9]\d{9}$/.test(f.phone)) return setErr('Enter a valid 10-digit mobile number.')
    if (f.password.length < 6) return setErr('Password must be at least 6 characters.')
    if (mode === 'register') {
      if (!f.name.trim()) return setErr('Please enter your name.')
      if (!f.region) return setErr('Choose which Kannada you speak.')
      if (!f.district) return setErr('Choose your district.')
      if (f.password !== f.confirm) return setErr('Passwords do not match.')
    }
    setBusy(true)
    const m = mode === 'login' ? await login(f.phone, f.password) : await register({ name: f.name.trim(), phone: f.phone, region: f.region, district: f.district, password: f.password })
    setBusy(false); if (m) setErr(m); else onSuccess?.()
  }
  return (
    <div className="grid min-h-screen bg-page lg:grid-cols-[1fr_1.1fr]">
      <aside className="flex flex-col justify-between bg-gradient-to-b from-maroon to-maroon2 p-8 text-white">
        <div><div className="font-display text-3xl leading-none text-gold">Namma</div><div className="font-display text-6xl font-extrabold leading-none text-gold">Kannada</div>
          <p className="mt-3 max-w-xs text-sm text-white/80">Different regions. Same heart. One Kannada.</p></div>
        <div className="py-6"><RegionMap me={f.region ? { region: f.region, district: f.district } : { region: "", district: "" }} className="mx-auto h-72" /></div>
        <p className="text-xs text-white/70">{f.region ? `${REGIONS.find(r => r.id === f.region)?.n}${f.district ? ' · ' + f.district : ''}` : 'Pick your Kannada while registering and watch your home light up.'}</p>
      </aside>
      <main className="grid place-items-center p-6">
        {mode === 'reset' ? <ResetForm onBack={() => setMode('login')} /> : <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl bg-surface p-6 shadow-card" noValidate>
          <div className="flex rounded-full bg-surface2 p-1 text-sm font-semibold">
            {(['login', 'register'] as const).map(m => <button type="button" key={m} onClick={() => { setMode(m); setErr('') }} className={`flex-1 rounded-full py-2 ${mode === m ? 'bg-primary text-onprimary shadow-glow' : 'text-muted'}`}>{m === 'login' ? 'Login' : 'Register'}</button>)}
          </div>
          <h1 className="font-display text-2xl font-bold text-maroon dark:text-gold">{mode === 'login' ? 'ಸ್ವಾಗತ! Welcome back' : 'ನಮ್ಮ ಕನ್ನಡಕ್ಕೆ ಸ್ವಾಗತ'}</h1>
          {mode === 'register' && <Field icon={UserIcon} placeholder="Full name" value={f.name} onChange={(e: any) => set('name', e.target.value)} autoComplete="name" />}
          <Field icon={Phone} placeholder="Phone number (10 digits)" inputMode="numeric" maxLength={10} value={f.phone} onChange={(e: any) => set('phone', e.target.value.replace(/\D/g, ''))} autoComplete="tel" />
          {mode === 'register' && <>
            <fieldset><legend className="mb-2 text-xs font-semibold text-muted">Which Kannada do you speak?</legend>
              <div className="grid grid-cols-2 gap-2">
                {REGIONS.map(r => <button type="button" key={r.id} onClick={() => set('region', r.id)} aria-pressed={f.region === r.id}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs ${f.region === r.id ? 'border-primary bg-primary font-semibold text-onprimary' : 'border-border bg-surface2'}`}>
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: r.c }} />{r.n}</button>)}
              </div></fieldset>
            <select value={f.district} onChange={e => set('district', e.target.value)} disabled={!f.region} aria-label="District" className="w-full rounded-xl border border-border bg-surface2 px-3 py-2.5 text-sm text-ink disabled:opacity-50">
              <option value="">{f.region ? 'Select your district' : 'Choose your Kannada first'}</option>
              {(DISTRICTS[f.region] || []).map(d => <option key={d}>{d}</option>)}
            </select></>}
          <Field icon={Lock} type="password" placeholder="Password" value={f.password} onChange={(e: any) => set('password', e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          {mode === 'register' && <Field icon={Lock} type="password" placeholder="Confirm password" value={f.confirm} onChange={(e: any) => set('confirm', e.target.value)} autoComplete="new-password" />}
          {err && <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{err}</p>}
          <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-semibold text-onprimary shadow-glow disabled:opacity-60">{busy ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}</button>
          {mode === 'login' && API && <button type="button" onClick={() => setMode('reset')} className="w-full text-center text-xs text-muted underline">Forgot password?</button>}
          {!API && <p className="text-center text-xs text-muted">Demo build: accounts are stored on this device only.</p>}
        </form>}
      </main>
    </div>
  )
}

function ResetForm({ onBack }: { onBack: () => void }) {
  const [phone, setPhone] = useState(''), [code, setCode] = useState(''), [pw, setPw] = useState(''), [sent, setSent] = useState(false), [err, setErr] = useState(''), [note, setNote] = useState(''), [busy, setBusy] = useState(false)
  const send = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) return setErr('Enter a valid 10-digit mobile number.')
    setBusy(true); const r = await requestOtp(phone); setBusy(false)
    if (r.error) return setErr(r.error)
    setErr(''); setSent(true); setNote(r.devCode ? `Dev mode: your code is ${r.devCode}` : 'If this number is registered, a code was sent by SMS.')
  }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(code)) return setErr('Enter the 6-digit code.')
    if (pw.length < 6) return setErr('Password must be at least 6 characters.')
    setBusy(true); const m = await resetPassword(phone, code, pw); setBusy(false); if (m) setErr(m)
  }
  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl bg-surface p-6 shadow-card" noValidate>
      <h1 className="font-display text-2xl font-bold text-maroon dark:text-gold">Reset password</h1>
      <Field icon={Phone} placeholder="Phone number (10 digits)" inputMode="numeric" maxLength={10} value={phone} onChange={(e: any) => { setErr(''); setPhone(e.target.value.replace(/\D/g, '')) }} />
      {!sent ? <button type="button" disabled={busy} onClick={send} className="w-full rounded-full bg-primary py-3 font-semibold text-onprimary shadow-glow disabled:opacity-60">{busy ? 'Please wait…' : 'Send code'}</button> : <>
        {note && <p role="status" className="rounded-lg bg-surface2 px-3 py-2 text-sm">{note}</p>}
        <Field icon={Lock} placeholder="6-digit code" inputMode="numeric" maxLength={6} value={code} onChange={(e: any) => { setErr(''); setCode(e.target.value.replace(/\D/g, '')) }} />
        <Field icon={Lock} type="password" placeholder="New password" value={pw} onChange={(e: any) => { setErr(''); setPw(e.target.value) }} autoComplete="new-password" />
        <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-semibold text-onprimary shadow-glow disabled:opacity-60">{busy ? 'Please wait…' : 'Set new password'}</button></>}
      {err && <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{err}</p>}
      <button type="button" onClick={onBack} className="w-full text-center text-xs text-muted underline">Back to login</button>
    </form>
  )
}
