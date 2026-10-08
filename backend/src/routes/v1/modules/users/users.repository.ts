import pool from '../../../../config/db.js'
import { mapPgError } from '../pgErrorMapper.js'

import type { UserData } from '../../../../types/user.js'
import { AppError } from '../../../../utils/errors.js'

/* export const userIdExists = async (userId: string): Promise<boolean> => {
  const res = await pool.query(
    `SELECT 1
     FROM users
     WHERE id = $1`,
    [userId]
  )

  return res.rows.length > 0
} */

export const getUserDataById = async (userId: string): Promise<UserData> => {
  const res = await pool.query<UserData>(
    `SELECT
      id, 
      username, 
      email, 
      theme, 
      created_at AS "createdAt"
     FROM users
     WHERE id = $1`,
    [userId]
  )

  return res.rows[0]
}

export const updateUsername = async (userId: string, newUsername: string): Promise<string> => {
  try {
    const res = await pool.query(
      `UPDATE users
       SET username = $1
       WHERE id = $2
       RETURNING username`,
      [newUsername, userId]
    )

    return res.rows[0]?.username
  } catch (error) {
    mapPgError(error, {
      '23505': () => {
        return new AppError({
          message: "username já está em uso",
          statusCode: 409,
          code: 'USERNAME_ALREADY_EXISTS',
          publicDetails: { field: "username" },
        })
      },
    })
  }
}