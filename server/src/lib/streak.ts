import { PoolClient } from 'pg'
import { config } from '../config'
import { pool } from '../db'

/** Call whenever a logged-in user does something. Handles day boundaries in the app timezone. */
export async function touchActivity(userId: string, c: PoolClient | typeof pool = pool) {
  // Missing exactly one day uses a streak freeze (users start with 1, and earn one back every 7-day streak, max 2).
  await c.query(
    `with t as (select (now() at time zone $2)::date as d)
     update users u set
       streak = case when u.last_active_date = t.d then u.streak
                     when u.last_active_date = t.d - 1 then u.streak + 1
                     when u.last_active_date = t.d - 2 and u.streak_freezes > 0 then u.streak + 1
                     else 1 end,
       streak_freezes = case when u.last_active_date = t.d - 2 and u.streak_freezes > 0 then u.streak_freezes - 1
                             when u.last_active_date = t.d - 1 and (u.streak + 1) % 7 = 0 then least(u.streak_freezes + 1, 2)
                             else u.streak_freezes end,
       last_active_date = t.d
     from t where u.id = $1`,
    [userId, config.timezone],
  )
}
