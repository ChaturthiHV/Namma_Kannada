# Namma Kannada · ನಮ್ಮ ಕನ್ನಡ

**Different regions. Same heart. One Kannada.**

Namma Kannada is a web app for exploring, hearing, comparing and preserving the regional dialects of Kannada. Kannada is not one voice: the way people speak in Mysuru, Dharwad, Mangaluru, Kalaburagi, Bengaluru and the Malnad hills differs in words, grammar and rhythm. This project puts those voices on a map, lets people listen to them, play games with them, and add the words their own families use, so that dialects stay recorded and respected rather than flattened into one "standard" form.

The whole interface works in **English** and in **ಕನ್ನಡ**, switchable at any time.

---

## Contents

1. [Features](#features)
2. [How contributions are verified](#how-contributions-are-verified)
3. [Tech stack](#tech-stack)
4. [Project structure](#project-structure)
5. [Run it locally](#run-it-locally)
6. [Demo mode vs full mode](#demo-mode-vs-full-mode)
7. [Environment variables](#environment-variables)
8. [Deploying to the web](#deploying-to-the-web)
9. [Roles and admin](#roles-and-admin)
10. [API reference](#api-reference)
11. [Database](#database)
12. [Language support (English / ಕನ್ನಡ)](#language-support-english--ಕನ್ನಡ)
13. [Audio](#audio)
14. [Progressive web app](#progressive-web-app)
15. [Known limits](#known-limits)
16. [Contributing](#contributing)

---

## Features

The app has a sidebar (bottom navigation on phones) with these sections:

| Page | What it does |
|---|---|
| **Home** | Hero with a search box and a Word of the Day, shortcut tiles to the main sections, an interactive **Explore by Region** map, a Featured Word with audio, and a "Keep Kannada Alive" call to action. |
| **Explore Karnataka Map** | A district-level map of Karnataka split into six dialect regions. Tap a region to read where it is spoken and to hear its words and phrases. Regions you have visited are remembered and marked. |
| **Living Language Map** | A heat map of the map regions. The more words contributed for a region, the darker it shows, so you can see which dialects are well documented and which need help. |
| **Voice Gallery** | Browse and play recorded words and phrases, grouped by region, in both audio and script. |
| **Speak Like a Local** | Listen to a phrase, record yourself saying it, and compare. Feedback is approximate and never pass or fail. With a speech-to-text service configured, it gives an estimated score; otherwise you rate yourself. |
| **Talk to a Local** | Short branching conversations (for example shopping with a vendor) in a regional dialect, with audio for each line. |
| **Smart Search** | Search words, phrases and regions in Kannada script, English or Latin spelling variants (for example *hogona*). Uses fuzzy matching on the server. |
| **Dialect Battle** | Pick a concept and see how the same meaning is said in different regions side by side. Dialects are compared, never merged. |
| **Dialect Detective** | A timed quiz: hear a phrase and guess its region. With the server, rounds are timed and scored by the server (15 seconds plus a 2 second grace, no repeats). No login is needed to play. |
| **Contribute a Word** | Submit a word or phrase with its meaning, region, an example sentence and an optional voice recording. Submissions wait for community approval. |
| **Profile** | Create an account, choose your district and dialect, and see your progress: words learned, regions explored, XP, streaks and stamps in a "passport". |
| **About** | What the project is for, plus counts of verified words and community submissions. |

Also included:

- **Light and dark theme** and a Kannada/English switch on every page.
- **Home region highlight:** after sign-up, your own dialect area glows on the maps and a pin marks your district.
- **Word of the Day**, leaderboard, and streaks (one missed day is forgiven automatically).
- **Open Dictionary export** of all verified entries as JSON or CSV.
- **Installable on phones** as a progressive web app.

## How contributions are verified

Dialect knowledge should be vouched for by people who speak that dialect.

1. Anyone logged in can submit a word, with the region it belongs to. A recording is optional, and the contributor must tick a consent box to share it openly.
2. The word appears as **Pending**, with a progress bar of approvals.
3. Only speakers of **the same dialect region** can approve it. Speakers of other regions see the lock and cannot vote. You cannot approve your own entry or vote twice.
4. After **10 approvals** (`VOTES_NEEDED` in `client/lib/data.ts`) it becomes **Verified**.
5. On the server, reviewers and admins can also approve, reject or dispute an entry directly, view the version history and roll back an edit. Every moderation action is written to a log.
6. A simple profanity filter and a duplicate-entry warning run on submission.

## Tech stack

**Client** (`client/`)
- Next.js 14 (App Router) and React 18, TypeScript
- Tailwind CSS 3 with CSS-variable theming (light and dark)
- Framer Motion for animation, Lucide for icons, `next-themes`
- Fonts: Baloo Tamma 2 (display), Noto Sans Kannada, Inter
- SVG map built from district shapes (`lib/karnataka-geo.ts`)

**Server** (`server/`)
- Node.js 18+, Express 4, TypeScript
- PostgreSQL 13+ with `pg` and the `pg_trgm` extension for fuzzy search
- JWT authentication, bcrypt password hashing, Zod validation
- Helmet, CORS allow-list, rate limiting, Morgan logging, Multer for audio upload

## Project structure

```
Namma_Karnataka/
├── client/                      Next.js web app
│   ├── app/                     Pages (one folder per route)
│   │   ├── page.tsx             Home
│   │   ├── map/  living/  voices/  speak/  talk/
│   │   ├── search/  battle/  detective/  contribute/
│   │   ├── profile/  about/
│   │   ├── api/translate/       Translation proxy used by the Kannada mode
│   │   ├── layout.tsx  providers.tsx  globals.css  manifest.ts
│   ├── components/              Sidebar, MobileNav, AuthGate, Hero, ModuleCards,
│   │                            RegionExplorer, RegionMap, FeaturedWord, RightRail, ui.tsx ...
│   ├── lib/
│   │   ├── api.ts               Fetch wrapper, token storage, progress sync
│   │   ├── auth.ts              Login/registration (server or demo mode)
│   │   ├── data.ts              Regions, seed entries, entries hook, audio playback
│   │   ├── i18n.tsx  dict.ts  kn.ts     English/Kannada system
│   │   ├── karnataka-geo.ts     Map geometry
│   │   ├── sentences.ts  wotd.ts        Seed phrases, Word of the Day
│   ├── public/                  Logo, palace image, icons, service worker, audio/*.mp3
│   └── scripts/                 Audio generation tools
├── server/                      Express API
│   ├── db/schema.sql  seed.sql  Tables and starter data
│   ├── src/
│   │   ├── index.ts  app.ts  db.ts  config/
│   │   ├── middleware/          Auth and roles, error handling
│   │   ├── lib/                 search, streaks, moderation, serializers, sms, asr
│   │   ├── routes/              auth, me, regions, concepts, entries, search, audio,
│   │   │                        corrections, reports, attempts, quiz, scenarios,
│   │   │                        pronunciation, misc
│   │   └── scripts/migrate.ts   Applies schema and seed, creates the first admin
│   ├── scripts/smoke.mjs       End-to-end check of a running API
│   └── uploads/                 Recorded audio (git-ignored)
└── package.json                 Root scripts
```

## Run it locally

You need **Node.js 18 or newer**. PostgreSQL 13+ is only needed for full mode.

### Quickest: demo mode (no database)

```bash
cd client
npm install
npm run dev
```

Open http://localhost:3000. Leave `NEXT_PUBLIC_API_URL` empty (see [Demo mode vs full mode](#demo-mode-vs-full-mode)).

### Full mode (client + server + database)

```bash
# 1. Create a database
createdb namma_kannada

# 2. Configure
cp server/.env.example server/.env          # set DATABASE_URL, JWT_SECRET, admin login
cp client/.env.example client/.env.local    # NEXT_PUBLIC_API_URL=http://localhost:4000

# 3. Install and set up
npm install                                 # root helper (concurrently)
npm run install:all                         # client and server dependencies
npm run db:migrate                          # tables, seed data, first admin user

# 4. Run both
npm run dev                                 # server on :4000, client on :3000

# 5. Optional: check the API end to end
npm run smoke
```

Root scripts: `dev`, `dev:server`, `dev:client`, `db:migrate`, `build`, `smoke`, `install:all`.

## Demo mode vs full mode

| | Demo mode | Full mode |
|---|---|---|
| Set by | `NEXT_PUBLIC_API_URL` empty | `NEXT_PUBLIC_API_URL` set to the server URL |
| Accounts | Stored in the browser | Real accounts in PostgreSQL |
| Contributions and votes | Saved on that device only | Shared by everyone |
| Voice recordings | Kept on the device | Uploaded to the server |
| Needs a database | No | Yes |
| Good for | Demos, design work, quick hosting | A real, shared community |

## Environment variables

### Client (`client/.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the Express server. Empty means demo mode. Baked in at build time. |
| `GOOGLE_TRANSLATE_API_KEY` | Optional. Uses the Google Cloud Translation API for Kannada mode instead of the free public endpoint. Server-side only. |

### Server (`server/.env`)

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port to listen on. |
| `NODE_ENV` | `development` | Use `production` when deployed. |
| `CLIENT_ORIGIN` | `http://localhost:3000` | Allowed browser origins, comma separated. Must match your website URL exactly. |
| `DATABASE_URL` | local Postgres | PostgreSQL connection string. |
| `DATABASE_SSL` | `false` | Set `true` for managed databases such as Neon, Supabase, Render or RDS. |
| `JWT_SECRET` | none in production | Long random string. The server refuses to start in production with the default. |
| `JWT_EXPIRES_IN` | `7d` | Login lifetime. |
| `ADMIN_PHONE`, `ADMIN_PASSWORD`, `ADMIN_NAME` | | First admin account, created by `db:migrate`. Change the password before going public. |
| `UPLOAD_DIR` | `uploads` | Where audio recordings are stored. |
| `MAX_AUDIO_MB` | `3` | Size limit for a recording. |
| `PUBLIC_URL` | empty | Absolute prefix for audio URLs, for example your server URL. |
| `APP_TIMEZONE` | `Asia/Kolkata` | Used for daily words and streaks. |
| `ASR_URL`, `ASR_MODEL`, `ASR_API_KEY` | empty | Optional speech-to-text endpoint (OpenAI compatible, Kannada supported) for pronunciation scoring. Empty means self-rating. |
| `SMS_WEBHOOK_URL`, `SMS_WEBHOOK_TOKEN` | empty | Where OTP messages are POSTed as `{to, message}` (MSG91, Twilio, Fast2SMS through a small webhook). Empty prints the code in the server log. |
| `OTP_DEV_ECHO` | `true` | Development only: shows the OTP in the reset screen. Ignored in production. |

Never commit `.env` files.

## Deploying to the web

A common free setup:

| Part | Service | Notes |
|---|---|---|
| Website | Vercel | Root directory `client`. Set `NEXT_PUBLIC_API_URL`. |
| API | Render (Web Service) | Root directory `server`. Build: `npm install --include=dev && npm run build`. Start: `npm start`. |
| Database | Neon | Copy the connection string, set `DATABASE_SSL=true`. |

Order of work:

1. Create the Neon database and copy its connection string.
2. On your computer, fill `server/.env` with that string and run `npm run db:migrate` once. This creates the tables, seed data and the admin user.
3. Deploy the server on Render with the environment variables above and set `NODE_ENV=production`.
4. Check `https://your-server/api/health`.
5. Deploy the client on Vercel with `NEXT_PUBLIC_API_URL` set to the server URL.
6. Set `CLIENT_ORIGIN` on the server to the Vercel URL and redeploy it.

For a simple online demo, deploy only the client with `NEXT_PUBLIC_API_URL` empty.

Before going live: use a strong `JWT_SECRET`, change the admin password, serve over HTTPS, connect an SMS provider for OTP, and move audio to object storage (S3 or R2) on hosts where the disk is wiped on restart (Render's free plan does this).

## Roles and admin

Accounts are keyed by a 10-digit Indian mobile number and a password. There are four roles:

| Role | Can do |
|---|---|
| `learner` | Play, search, listen, track progress. |
| `contributor` | Submit words, suggest corrections, vote on entries from their own dialect. |
| `reviewer` | Approve, reject or dispute entries, roll back edits, add cultural notes, handle reports. |
| `admin` | Everything a reviewer can, plus manage users and roles. |

There is **no separate admin web page**. The admin is a normal account (created by `db:migrate` from `ADMIN_PHONE` and `ADMIN_PASSWORD`) that logs in on the normal login screen. Its extra rights apply to the server's reviewer and admin endpoints.

## API reference

All routes are under `/api`. "Auth" says who may call them.

| Method and path | Auth | Purpose |
|---|---|---|
| GET `/health`, `/stats`, `/word-of-the-day` | none | Status, counters, daily word |
| POST `/auth/register`, `/auth/login`; GET `/auth/me` | none / token | Accounts |
| POST `/auth/otp/request`, `/auth/otp/login`, `/auth/reset-password` | none | OTP flows (10 minute expiry, 5 tries, single use) |
| GET/PATCH `/me`; GET `/me/stamps` | user | Profile and passport |
| GET `/me/state`; PUT `/me/state/:key` | user | Progress sync (explored, learned, best, points) |
| GET `/regions`, `/regions/:id` | none | Region info and counts |
| GET `/concepts?battle=1`, `/concepts/:id` | none | Dialect Battle data |
| GET `/entries?region=&concept=&status=&q=` | optional | List, filter, search |
| GET `/entries/:id` | none | Detail with notes and variants |
| POST `/entries` | user | Contribute (starts Pending) |
| PATCH `/entries/:id/status` | reviewer | Approve, reject, dispute |
| GET `/entries/:id/versions`; POST `/entries/:id/rollback` | reviewer | History |
| POST `/entries/:id/notes` | reviewer | Cultural note |
| GET `/search?q=&type=all\|words\|phrases\|regions` | none | Smart search |
| GET/POST `/entries/:id/audio`; DELETE `/audio/:id` | none / user / owner | Voice recordings (consent required) |
| GET/POST `/entries/:id/corrections`; POST `/corrections/:id/vote`; PATCH `/corrections/:id` | none / user / user / reviewer | Suggested edits |
| POST `/reports`; GET/PATCH `/reports` | optional / reviewer | Report an entry |
| POST `/attempts`; GET `/attempts/leaderboard` | user / none | Games |
| POST `/quiz/start`, `/quiz/next`, `/quiz/answer` | user | Server-timed Detective rounds |
| GET `/scenarios` | none | Talk to a Local dialogues |
| GET `/pronunciation/status`; POST `/pronunciation/score` | none / user | Approximate score (audio is discarded) |
| GET `/admin/overview`, `/admin/moderation-log` | reviewer | Dashboard data |
| GET `/admin/users`; PATCH `/admin/users/:id/role` | admin | User management |
| GET `/export/dictionary?format=json\|csv` | none | Open dictionary export |

Rate limits: 600 requests per 15 minutes per client on the API, and 40 per 15 minutes on `/auth`.

## Database

PostgreSQL schema in `server/db/schema.sql`, seed data in `server/db/seed.sql`. Applied by `npm run db:migrate` (production: `npm run db:migrate:prod` after building). Tables:

`regions`, `districts`, `users`, `concepts`, `entries`, `spelling_variants`, `entry_versions`, `entry_votes`, `audio`, `corrections`, `correction_votes`, `reports`, `moderation_log`, `user_state`, `progress`, `attempts`, `otp_codes`, `quiz_sessions`, `scenarios`, `scenario_nodes`.

A **concept** is a meaning ("What are you doing?"); each **entry** is one region's way of saying it. This is what powers Dialect Battle and keeps dialects side by side instead of merged.

## Language support (English / ಕನ್ನಡ)

One switch, no mixing. English mode is all English. Kannada mode is all Kannada: menus, buttons, placeholders, errors, region and district names, meanings.

- `client/lib/i18n.tsx` provides `useI18n()` with `t()` for UI text, `tr()` for dynamic text, `nm()` for names, and `region()` and `district()`.
- `client/lib/dict.ts` holds hand-written Kannada UI strings. `client/lib/kn.ts` holds regions, region notes and districts.
- Any string not in the dictionary goes through `client/app/api/translate/route.ts` and is cached in the browser. Names typed in English letters are transliterated into Kannada script.
- In Kannada mode the Latin romanisation lines are hidden.

To add a UI string, wrap it in `t('English text')`. For best quality, add the Kannada to `dict.ts`.

## Audio

`client/public/audio/<key>.mp3` holds a clip for each Kannada word and sentence, named by a hash of the text. Playback order:

1. a community recording, if the entry has one;
2. the pre-generated clip for that text;
3. the device's own Kannada voice (`kn-IN`).

The clips were generated with AI4Bharat Indic-TTS. Regenerating after adding words is described in `client/scripts/README-audio.md`. The best option is always to replace a clip with a real recording saved under the same file name.

## Progressive web app

The app has a web manifest, icons and a service worker (`public/sw.js`), so it can be installed to a phone's home screen and behaves like an app, with safe-area support and a bottom navigation bar on small screens.

## Known limits

- **Placeholder dialect data.** The seed words, 180 generated phrases (30 sentences × 6 regions) and the Talk to a Local dialogues must be reviewed by native speakers before real use. They are marked pending for that reason.
- **Pronunciation score is a hint.** It compares a speech-to-text transcript with the expected word, and Kannada recognition is imperfect. It needs `ASR_URL`.
- **No social login.** Accounts use a phone number and password; OTP needs an SMS provider.
- **No admin web screen.** Moderation is done through the API and role-guarded endpoints.
- **Audio storage.** Recordings are saved to the server disk, which hosts with ephemeral disks erase on restart.
- **Map regions are approximate.** Dialects form a continuum; the map shows dialect areas, not hard borders.
- Run `npm run smoke` after `db:migrate` to check the server end to end.

## Contributing

The most valuable contribution is **words and voices**: add the words, phrases and sayings your family and town use, with a recording if you can, and vote on entries from your own dialect.

For code:

1. Fork the repo and create a branch.
2. Run the app locally (see above) and keep changes focused.
3. Run `npx tsc --noEmit` in `client` and `server` before opening a pull request.
4. Describe what changed and, for UI work, include a screenshot in both languages if text changed.

Please keep the project respectful: no slurs, no mocking of any dialect or community.

---

*Namma Kannada: different regions, same heart, one Kannada.*
