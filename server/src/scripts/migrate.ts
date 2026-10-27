import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { config } from '../config'
import { pool } from '../db'

// Works from src/scripts (tsx) and dist/scripts (node): both resolve to server/db
const dir = path.resolve(__dirname, '..', '..', 'db')

async function main() {
  for (const f of ['schema.sql', 'seed.sql']) {
    await pool.query(fs.readFileSync(path.join(dir, f), 'utf8'))
    console.log('applied', f)
  }
  const { phone, password, name } = config.admin
  if (phone && password) {
    const hash = await bcrypt.hash(password, 10)
    const r = await pool.query(
      `insert into users (name, phone, password_hash, role) values ($1,$2,$3,'admin')
       on conflict (phone) do nothing`, [name, phone, hash])
    console.log(r.rowCount ? `created admin ${phone}` : `admin ${phone} already exists`)
  }
  await pool.end()
}
main().catch(e => { console.error(e); process.exit(1) })
