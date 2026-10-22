import pool from '../../../../config/db.js'
import { mapPgError } from '../pgErrorMapper.js'

import type { UserData } from '../../../../types/user.js'
import { AppError } from '../../../../utils/errors.js'
import type { updateSettingsInput, UserTheme } from '../../../../types/user.js'

export const getUserDataById = async (userId: string): Promise<UserData | undefined> => {
  const { rows } = await pool.query<UserData>(
    `
    SELECT
      id, 
      username, 
      email, 
      theme, 
      created_at AS "createdAt"
    FROM users
    WHERE id = $1
    `,
    [userId],
  )

  return rows[0]
}

// O if (!req.userId) no controller só garante que o middleware rodou e que preencheu o id
// não necessariamente isso garante que o id exista na tabela naquele momento

export const updateUsername = async (
  userId: string,
  newUsername: string,
): Promise<string | undefined> => {
  try {
    const { rows } = await pool.query<{ username: string }>(
      `
      UPDATE users
      SET 
        username = $1,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2
      RETURNING username
      `,
      [newUsername, userId],
    )

    return rows[0]?.username
  } catch (error) {
    mapPgError(error, {
      '23505': () => {
        return new AppError({
          message: 'username já está em uso',
          statusCode: 409,
          code: 'USERNAME_ALREADY_EXISTS',
          publicDetails: { field: 'username' },
        })
      },
    })
  }
}

export const updateSettings = async (
  userId: string,
  newTheme: UserTheme,
): Promise<UserTheme | undefined> => {
  try {
    const { rows } = await pool.query<updateSettingsInput>(
      `
      UPDATE users
      SET 
        theme = $1,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2
      RETURNING theme
      `,
      [newTheme, userId],
    )

    return rows[0]?.theme
  } catch (error) {
    mapPgError(error, {
      '23514': () => {
        return new AppError({
          message: 'tema deve ser apenas escuro, branco ou padrão do sistema',
          statusCode: 409,
          code: 'THEME_NOT_ALLOWED',
          publicDetails: { field: 'theme' },
        })
      },
    })
  }
}

export const getPasswordHashById = async (userId: string): Promise<string | undefined> => {
  const { rows } = await pool.query<{ passwordHash: string }>(
    `
    SELECT password_hash AS "passwordHash"
    FROM users
    WHERE id = $1
    `,
    [userId],
  )

  return rows[0]?.passwordHash
}

export const updatePassword = async (
  userId: string,
  currentPasswordHash: string,
  newPasswordHash: string,
): Promise<boolean> => {
  const { rowCount } = await pool.query(
    `
    UPDATE users
    SET
      password_hash = $1,
      updated_at = CURRENT_TIMESTAMP,
      refresh_token_hash = NULL
    WHERE 
      id = $2 
    AND 
      password_hash = $3
    `,
    [newPasswordHash, userId, currentPasswordHash],
  )

  return rowCount === 1
}

export const deleteAccount = async (userId: string, passwordHash: string): Promise<boolean> => {
  const { rowCount } = await pool.query(
    `
    DELETE
    FROM users
    WHERE 
      id = $1
    AND
      password_hash = $2
    `,
    [userId, passwordHash],
  )

  return rowCount === 1
}
