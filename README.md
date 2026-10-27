# Namma Kannada
Different regions. Same heart. One Kannada.

```
Namma_Karnataka/
├── client/                  Next.js 14 + Tailwind + Framer Motion (your existing UI, unchanged)
│   ├── app/  components/    pages and UI: untouched
│   ├── lib/
│   │   ├── api.ts           NEW  fetch wrapper, token storage, progress sync
│   │   ├── auth.ts          uses the server when NEXT_PUBLIC_API_URL is set, else localStorage demo
│   │   └── data.ts          same switch for entries / contributions / moderation
├── server/                  NEW  Express + TypeScript + PostgreSQL
│   ├── db/schema.sql        all tables from the blueprint data model
│   ├── db/seed.sql          6 regions, districts, 15 placeholder entries, stamps
│   ├── src/
│   │   ├── index.ts, app.ts, db.ts, config/
│   │   ├── middleware/      JWT auth + roles, error handling
│   │   ├── lib/             search (pg_trgm), streaks, profanity filter, serializers
│   │   ├── routes/          auth, me, regions, concepts, entries, search, audio,
│   │   │                    corrections, reports, attempts, admin, misc
│   │   └── scripts/migrate.ts   applies schema + seed + creates the first admin
│   ├── scripts/smoke.mjs    end-to-end check of a running API
│   ├── uploads/             recorded audio (git-ignored)
└── package.json             root scripts (dev, db:migrate, smoke)
```

## Run it

Needs Node 18+ and PostgreSQL 13+.
```
createdb namma_kannada
cp server/.env.example server/.env        # set DATABASE_URL (your Postgres password) and JWT_SECRET
cp client/.env.example client/.env.local  # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install                               # root (concurrently)
npm run install:all
npm run db:migrate                        # schema + seed + admin user
npm run dev                               # server :4000, client :3000
npm run smoke                             # optional: verifies the API end to end
```
Admin login (from `server/.env`): phone `9999999999`, password `admin123`. Change it.
The Admin page only works for `reviewer`/`admin` accounts; normal users get a 403 from the server.

Leave `NEXT_PUBLIC_API_URL` empty and the client runs in localStorage demo mode.

## Optional switches (server/.env)
- `ASR_URL`: any OpenAI-compatible speech-to-text endpoint that supports Kannada. Empty = pronunciation score stays self-rated.
- `SMS_WEBHOOK_URL`: where OTP texts are POSTed as `{to, message}`. Empty = code is printed in the server log.
- `OTP_DEV_ECHO=true`: shows the OTP on the reset screen while developing. Ignored in production.

## What was missing and is now there
| Gap | Now |
|---|---|
| Backend | Express REST API under `/api` |
| Real database | PostgreSQL schema covering users, regions, concepts, entries, audio, corrections, cultural_notes, progress, stamps, attempts, reports + moderation log, entry versions, spelling variants |
| Real auth | Phone + password, bcrypt hashes, JWT, roles (learner / contributor / reviewer / admin) |
| Moderation | Role-guarded approve / reject / dispute, moderation log, version history + rollback, reports, correction voting |
| Audio | Upload with mandatory consent, size/type limits, delete-my-recording |
| Search | Substring + trigram fuzzy + spelling variants |
| Progress | Stamps, learned words, best score, points and streaks saved per account |
| Added in round 2 | Share recordings on Speak Like a Local, optional automatic pronunciation score, Talk to a Local scenarios from the database, server-timed Dialect Detective, OTP password reset, streak freeze |
| Extras | Word of the Day, stats for the Living Map, leaderboard, Open Dictionary export (JSON/CSV), rate limiting, CORS, Helmet |

## API summary (all under `/api`)
| Method + path | Auth | Purpose |
|---|---|---|
| GET `/health`, `/stats`, `/word-of-the-day` | none | status, counters, daily word |
| POST `/auth/register`, `/auth/login`; GET `/auth/me` | none / token | accounts |
| GET/PATCH `/me`; GET `/me/stamps` | user | profile, passport |
| GET `/me/state`; PUT `/me/state/:key` (explored, learned, best, points) | user | progress sync |
| GET `/regions`, `/regions/:id` | none | region info + counts |
| GET `/concepts?battle=1`, `/concepts/:id` | none | Dialect Battle data |
| GET `/entries?region=&concept=&status=&q=` | optional | list / filter / search |
| GET `/entries/:id` | none | detail + notes + variants |
| POST `/entries` | user | contribute (pending) |
| PATCH `/entries/:id/status` | reviewer | approve / reject / dispute |
| GET `/entries/:id/versions`; POST `/entries/:id/rollback` | reviewer | history |
| POST `/entries/:id/notes` | reviewer | cultural note |
| GET `/search?q=&type=all|words|phrases|regions` | none | smart search |
| GET/POST `/entries/:id/audio`; DELETE `/audio/:id` | none / user / owner | voice recordings |
| GET/POST `/entries/:id/corrections`; POST `/corrections/:id/vote`; PATCH `/corrections/:id` | none / user / user / reviewer | suggested edits |
| POST `/reports`; GET/PATCH `/reports` | optional / reviewer | report an entry |
| POST `/attempts`; GET `/attempts/leaderboard` | user / none | games |
| GET `/admin/overview`, `/admin/moderation-log` | reviewer | dashboard |
| GET `/admin/users`; PATCH `/admin/users/:id/role` | admin | user management |
| GET `/export/dictionary?format=json|csv` | none | open data |

## New endpoints
| Method + path | Auth | Purpose |
|---|---|---|
| POST `/quiz/start`, `/quiz/next`, `/quiz/answer` | user | Detective rounds timed and scored by the server (15s + 2s grace, no repeats) |
| GET `/scenarios` | none | Talk to a Local dialogue trees |
| GET `/pronunciation/status`; POST `/pronunciation/score` | none / user | approximate score via speech-to-text, audio is discarded |
| POST `/auth/otp/request`, `/auth/otp/login`, `/auth/reset-password` | none | OTP flows (10 min expiry, 5 tries, single use) |

## Known limits
- Not run end to end here: the build sandbox had no network or PostgreSQL. All TypeScript was syntax-checked only. Run `npm run smoke` after `db:migrate`.
- Pronunciation scoring compares an ASR transcript with the expected word. Kannada ASR is imperfect, so treat the number as a hint. Needs `ASR_URL`.
- Google/social login is not included (accounts are keyed by phone number).
- Streak freeze: one missed day is forgiven automatically (1 freeze to start, +1 per 7-day streak, max 2).
- If the server rejects an action (e.g. a non-reviewer on the Admin page), the page cannot show the error; it is logged in the browser console.
- Dialect text and all Talk to a Local dialogue are placeholders: have native speakers verify them.
- Before going live: strong `JWT_SECRET`, new admin password, HTTPS, an SMS provider for OTP, and object storage (S3/R2) for audio on hosts with ephemeral disks.
