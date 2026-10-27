'use client'
import { useState } from 'react'
import Link from 'next/link'
import { User as UserIcon, Phone, MapPin, Edit3, Check, LogOut, BookOpen, Trophy, Flame, Compass, ArrowRight, Sparkles } from 'lucide-react'
import { useUser, logout, updateProfile, DISTRICTS } from '@/lib/auth'
import { REGIONS, useLS } from '@/lib/data'
import RegionMap from '@/components/RegionMap'
import { AuthScreen } from '@/components/AuthGate'
import { PageHead } from '@/components/ui'

export default function ProfilePage() {
  const u = useUser()
  const [editing, setEditing] = useState(false)
  const [f, setF] = useState({ name: '', region: '', district: '' })
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ text: string; err: boolean } | null>(null)

  // Learning stats
  const [learned] = useLS<string[]>('learned', [])
  const [explored] = useLS<string[]>('explored', [])
  const [points] = useLS<number>('points', 0)
  const [best] = useLS<number>('best', 0)

  const startEdit = () => {
    if (!u) return
    setF({ name: u.name, region: u.region, district: u.district })
    setStatusMsg(null)
    setEditing(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.name.trim()) {
      setStatusMsg({ text: 'Please enter your name.', err: true })
      return
    }
    if (!f.region) {
      setStatusMsg({ text: 'Please choose your Kannada dialect.', err: true })
      return
    }
    if (!f.district) {
      setStatusMsg({ text: 'Please select your district.', err: true })
      return
    }

    setSaving(true)
    setStatusMsg(null)
    const err = await updateProfile({ name: f.name.trim(), region: f.region, district: f.district })
    setSaving(false)

    if (err) {
      setStatusMsg({ text: err, err: true })
    } else {
      setStatusMsg({ text: 'Profile updated successfully!', err: false })
      setEditing(false)
    }
  }

  // Guest view: Show Auth Screen to login or register
  if (!u) {
    return (
      <div className="p-5 md:p-8">
        <PageHead
          en="My Profile"
          kn="ನನ್ನ ಪ್ರೊಫೈಲ್"
          sub="Sign in or create an account to personalize your Kannada experience, save learning progress, and explore regional dialects."
        />

        <div className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
          <div className="bg-gradient-to-r from-maroon via-maroon2 to-[#4a1012] p-6 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-gold backdrop-blur-md">
                <UserIcon size={24} />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-gold">ನಮ್ಮ ಕನ್ನಡ ಪ್ರೊಫೈಲ್</h2>
                <p className="text-xs text-white/80">Login or create an account to unlock personalized dialect features</p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <AuthScreen />
          </div>
        </div>
      </div>
    )
  }

  const curRegion = REGIONS.find(r => r.id === u.region)
  const initial = u.name ? u.name.trim()[0].toUpperCase() : 'K'

  return (
    <div className="space-y-6 p-5 md:p-8">
      <PageHead
        en="My Profile"
        kn="ನನ್ನ ಪ್ರೊಫೈಲ್"
        sub="Manage your personal dialect settings, view learning statistics, and track your dialect journey."
      />

      {/* Main Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
        <div className="h-28 bg-gradient-to-r from-maroon via-maroon2 to-[#5c1319] sm:h-36">
          <div className="absolute right-6 top-4 opacity-15">
            <Sparkles size={110} className="text-gold" />
          </div>
        </div>

        <div className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="-mt-14 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              <div
                className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl text-3xl font-black text-white shadow-xl ring-4 ring-surface"
                style={{ background: curRegion?.c || '#8e1015' }}
              >
                {initial}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{u.name}</h1>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Dialect Explorer
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-xs text-muted sm:justify-start">
                  {u.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={13} />
                      {u.phone}
                    </span>
                  )}
                  {u.district && (
                    <span className="flex items-center gap-1 font-medium text-ink">
                      <MapPin size={13} className="text-primary" />
                      {u.district}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => (editing ? setEditing(false) : startEdit())}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface2 px-4 py-2 text-xs font-semibold text-ink hover:border-primary transition"
              >
                <Edit3 size={14} />
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-danger hover:bg-danger/10 transition"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          </div>

          {/* Dialect Banner */}
          <div
            className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 transition"
            style={{
              background: (curRegion?.c || '#8e1015') + '15',
              border: `1px solid ${(curRegion?.c || '#8e1015')}35`,
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="h-4 w-4 shrink-0 rounded-full shadow-sm"
                style={{ background: curRegion?.c || '#8e1015' }}
              />
              <div>
                <p className="text-xs font-semibold text-muted">Home Dialect (ಸ್ಥಳೀಯ ಉಪಭಾಷೆ)</p>
                <p className="font-display font-bold text-ink sm:text-lg">{curRegion?.n || 'Karnataka Kannada'}</p>
              </div>
            </div>
            <div className="text-xs text-muted sm:text-right">
              District: <b className="text-ink">{u.district}</b>
            </div>
          </div>

          {statusMsg && (
            <div
              className={`mt-4 rounded-xl p-3 text-xs font-semibold ${
                statusMsg.err ? 'bg-danger/10 text-danger' : 'bg-green-600/10 text-green-700 dark:text-green-400'
              }`}
            >
              {statusMsg.text}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Form */}
      {editing && (
        <form onSubmit={handleSave} className="card space-y-4 rounded-3xl !p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-maroon dark:text-gold">Edit Your Details</h3>
            <span className="text-xs text-muted">Update your dialect region & district</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Full Name</label>
            <input
              type="text"
              value={f.name}
              onChange={e => setF({ ...f, name: e.target.value })}
              className="inp w-full"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-2">Which Kannada do you speak?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {REGIONS.map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setF({ ...f, region: r.id, district: '' })}
                  className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs transition ${
                    f.region === r.id
                      ? 'border-primary bg-primary font-semibold text-onprimary shadow-glow'
                      : 'border-border bg-surface2 hover:border-primary/50 text-ink'
                  }`}
                >
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: r.c }} />
                  <span className="truncate">{r.n}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">District</label>
            <select
              value={f.district}
              onChange={e => setF({ ...f, district: e.target.value })}
              disabled={!f.region}
              className="inp w-full"
            >
              <option value="">{f.region ? 'Select your district' : 'Choose your Kannada first'}</option>
              {(DISTRICTS[f.region] || []).map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold hover:bg-surface2 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-onprimary shadow-glow hover:opacity-90 disabled:opacity-50 transition"
            >
              <Check size={15} />
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Learning & Activity Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card flex items-center gap-3.5 rounded-2xl !p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <BookOpen size={22} />
          </span>
          <div className="min-w-0">
            <div className="font-display text-2xl font-bold text-ink">{Array.isArray(learned) ? learned.length : 0}</div>
            <div className="truncate text-xs text-muted">Words Learned</div>
          </div>
        </div>

        <div className="card flex items-center gap-3.5 rounded-2xl !p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
            <Compass size={22} />
          </span>
          <div className="min-w-0">
            <div className="font-display text-2xl font-bold text-ink">{Array.isArray(explored) ? explored.length : 0}</div>
            <div className="truncate text-xs text-muted">Regions Explored</div>
          </div>
        </div>

        <div className="card flex items-center gap-3.5 rounded-2xl !p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
            <Trophy size={22} />
          </span>
          <div className="min-w-0">
            <div className="font-display text-2xl font-bold text-ink">{points || 0}</div>
            <div className="truncate text-xs text-muted">Battle Points</div>
          </div>
        </div>

        <div className="card flex items-center gap-3.5 rounded-2xl !p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <Flame size={22} />
          </span>
          <div className="min-w-0">
            <div className="font-display text-2xl font-bold text-ink">{best || 0}</div>
            <div className="truncate text-xs text-muted">Best Streak</div>
          </div>
        </div>
      </div>

      {/* Map & Cultural Notes Section */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="card rounded-3xl !p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-maroon dark:text-gold">Your Karnataka Map Location</h3>
              <p className="text-xs text-muted">Your dialect & district highlighted on the map</p>
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: (curRegion?.c || '#8e1015') + '22', color: curRegion?.c }}
            >
              <MapPin size={12} />
              {u.district}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface2/50 p-4">
            <RegionMap me={{ region: u.region, district: u.district }} className="mx-auto h-72 max-w-full" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card rounded-3xl !p-6 shadow-card space-y-3">
            <h3 className="font-display text-lg font-bold text-maroon dark:text-gold">About Your Dialect Region</h3>
            <p className="text-sm font-semibold text-ink">{curRegion?.n}</p>
            <p className="text-xs leading-relaxed text-muted">{curRegion?.note}</p>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Districts in this dialect area</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(DISTRICTS[u.region] || []).map(d => (
                  <span
                    key={d}
                    className={`rounded-lg px-2.5 py-1 text-xs ${
                      d === u.district
                        ? 'bg-primary text-onprimary font-semibold shadow-sm'
                        : 'bg-surface2 text-muted border border-border'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="card rounded-3xl !p-6 shadow-card space-y-3">
            <h3 className="font-display text-lg font-bold text-maroon dark:text-gold">Dialect Activities</h3>
            <div className="space-y-2">
              <Link
                href="/map"
                className="flex items-center justify-between rounded-xl bg-surface2 p-3 text-xs font-semibold text-ink hover:border-primary border border-transparent transition"
              >
                <span>Explore Dialect Words</span>
                <ArrowRight size={14} className="text-muted" />
              </Link>
              <Link
                href="/speak"
                className="flex items-center justify-between rounded-xl bg-surface2 p-3 text-xs font-semibold text-ink hover:border-primary border border-transparent transition"
              >
                <span>Speak Like a Local</span>
                <ArrowRight size={14} className="text-muted" />
              </Link>
              <Link
                href="/battle"
                className="flex items-center justify-between rounded-xl bg-surface2 p-3 text-xs font-semibold text-ink hover:border-primary border border-transparent transition"
              >
                <span>Dialect Battle Arena</span>
                <ArrowRight size={14} className="text-muted" />
              </Link>
              <Link
                href="/contribute"
                className="flex items-center justify-between rounded-xl bg-surface2 p-3 text-xs font-semibold text-ink hover:border-primary border border-transparent transition"
              >
                <span>Contribute a Word from {u.district}</span>
                <ArrowRight size={14} className="text-muted" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
