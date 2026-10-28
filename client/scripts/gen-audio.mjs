// Pre-generates an audio clip for every Kannada word / sentence used in the app.
//   node scripts/gen-audio.mjs          (needs: espeak-ng + ffmpeg installed)
// Files land in public/audio/<key>.mp3 where <key> = audioKey(text) (same function as lib/data.ts).
// Re-run after adding new seed words/sentences. Clips that already exist are skipped.
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url)) + '/..'
const OUT = path.join(root, 'public/audio'); mkdirSync(OUT, { recursive: true })

export const norm = s => s.replace(/[“”"]/g, '').replace(/\s+/g, ' ').trim()
export const audioKey = str => { // cyrb53 - identical copy lives in lib/data.ts
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57
  for (let i = 0; i < str.length; i++) { const ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677) }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}

const FILES = ['lib/data.ts', 'lib/sentences.ts', 'lib/wotd.ts', 'app/talk/page.tsx', 'app/detective/page.tsx', 'components/FeaturedWord.tsx', '../server/db/seed.sql']
const re = /(['"`])((?:(?!\1)[^\n\\])*?[\u0C80-\u0CFF](?:(?!\1)[^\n\\])*?)\1/g
const texts = new Set()
for (const f of FILES) {
  let src; try { src = readFileSync(path.join(root, f), 'utf8') } catch { continue }
  for (const m of src.matchAll(re)) { const t = norm(m[2]); if (/[\u0C80-\u0CFF]/.test(t) && !/[A-Za-z]{3,}/.test(t)) texts.add(t) }
}
// Words that only exist in the English dictionary-of-UI are intentionally not voiced.
const list = [...texts]
console.log(list.length, 'unique Kannada strings')
const INDEX_ONLY = process.argv.includes('--index-only') // just refresh public/audio/index.json (used by gen_audio_indic.py)

const run = (cmd, args, input) => new Promise((res, rej) => { const p = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] }); let err = ''; p.stderr.on('data', d => err += d); p.on('close', c => c ? rej(new Error(cmd + ' ' + err.slice(-200))) : res()); input ? p.stdin.end(input) : p.stdin.end() })
const gen = t => new Promise((res, rej) => {
  const out = path.join(OUT, audioKey(t) + '.mp3')
  if (existsSync(out)) return res('skip')
  const es = spawn('espeak-ng', ['-v', 'kn', '-s', '125', '-p', '50', '-a', '160', '-g', '4', '--stdout', t])
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', 'pipe:0', '-ac', '1', '-ar', '22050', '-af', 'highpass=f=70,loudnorm=I=-18:TP=-2,apad=pad_dur=0.15', '-c:a', 'libmp3lame', '-b:a', '48k', out])
  es.stdout.pipe(ff.stdin); es.on('error', rej); ff.on('error', rej)
  ff.on('close', c => c ? rej(new Error('ffmpeg failed for ' + t)) : res('ok'))
})
let i = 0, done = 0, fail = []
if (INDEX_ONLY) { writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(Object.fromEntries(list.map(t => [audioKey(t), t])), null, 0)); console.log('index written'); process.exit(0) }
await Promise.all(Array.from({ length: 6 }, async () => { while (i < list.length) { const t = list[i++]; try { await gen(t) } catch (e) { fail.push(t) } if (++done % 100 === 0) console.log(done, '/', list.length) } }))
writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(Object.fromEntries(list.map(t => [audioKey(t), t])), null, 0))
console.log('done. failed:', fail.length, fail.slice(0, 5))
