import { Pool, PoolClient } from 'pg'
import { config } from './config'

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.dbSsl ? { rejectUnauthorized: false } : undefined,
  max: 10,
})

export const q = (text: string, params?: any[]) => pool.query(text, params)

/** Run fn inside a transaction. Rolls back on any error. */
export async function tx<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const c = await pool.connect()
  try {
    await c.query('begin')
    const r = await fn(c)
    await c.query('commit')
    return r
  } catch (e) {
    await c.query('rollback').catch(() => {})
    throw e
  } finally {
    c.release()
  }
}
