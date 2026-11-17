import pool from "../../../config/db.js"

export const userIdExists = async (userId: string): Promise<boolean> => {
  const { rows } = await pool.query<{ '?column?': number }>(
    `
    SELECT 1 
    FROM users 
    WHERE id = $1
    `,
    [userId],
  )

  return rows.length > 0
}