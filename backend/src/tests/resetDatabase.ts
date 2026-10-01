import pool from '../config/db.js'

export async function resetDatabase() {
  await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
}
