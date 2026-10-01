import pool from '../../../../config/db.js'
import { mapPgError } from '../pgErrorMapper.js'
import { AppError } from '../../../../utils/errors.js'

import type { CreatedUser, CreateUserInput, UserPasswordId } from '../../../../types/user.js'

//fiz dessa maneira pq o objetivo dessa funcao é apenas verificar se o email/username existe ou n no db
//como username e email tem a constraind UNIQUE ou existe 1 ou n
export const emailExists = async (email: string): Promise<boolean> => {
  const res = await pool.query(
    `SELECT 1 
     FROM users 
     WHERE email = $1`,
    [email],
  )

  return res.rows.length > 0
}

export const usernameExists = async (username: string): Promise<boolean> => {
  const res = await pool.query(
    `SELECT 1 
     FROM users 
     WHERE username = $1`,
    [username],
  )

  return res.rows.length > 0
}

export const createUser = async ({
  id,
  username,
  email,
  passwordHash,
  refreshTokenHash,
}: CreateUserInput): Promise<CreatedUser> => {
  try {
    const res = await pool.query<CreatedUser>(
      `
      INSERT INTO users
        (
          id, 
          username, 
          email, 
          password_hash, 
          refresh_token_hash
        )
      VALUES($1, $2, $3, $4, $5)
      RETURNING id, username    
      `,
      [id, username, email, passwordHash, refreshTokenHash],
    )

    return res.rows[0]
  } catch (error) {
    mapPgError(error, {
      '23505': (e) => {
        const field = e.constraint === 'users_username_unique' ? 'username' : 'email'
        return new AppError({
          message: `${field === 'username' ? 'Nome de usuário' : 'Email'} já está em uso`,
          statusCode: 409,
          code: 'DUPLICATE_FIELD',
          publicDetails: { field },
        })
      },
    })
  }
}

export const getUserByEmail = async (email: string): Promise<UserPasswordId | undefined> => {
  const res = await pool.query(
    `SELECT id, password_hash AS "passwordHash" 
     FROM users 
     WHERE email = $1`,
    [email],
  )

  return res.rows[0]
}

// password_hash AS "passwordHash"
//feito para n dar erro na hora do ts compilar na parte da desestruturação no service

export const saveNewRefreshToken = async (refreshTokenHash: string, id: string): Promise<void> => {
  await pool.query(
    `UPDATE users 
     SET 
      refresh_token_hash = $1, 
      updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2`,
    [refreshTokenHash, id],
  )
}

// usada em testes
export const getRefreshTokenHashById = async (userId: string): Promise<string | undefined> => {
  const res = await pool.query(
    `SELECT refresh_token_hash AS "refreshTokenHash" 
     FROM users 
     WHERE id = $1`,
    [userId],
  )

  return res.rows[0]?.refreshTokenHash
}

export const rotateRefreshTokenHash = async (
  userId: string,
  oldHash: string,
  newHash: string,
): Promise<boolean> => {
  const res = await pool.query(
    `UPDATE users
     SET
      refresh_token_hash = $1,
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND refresh_token_hash = $3`,
    [newHash, userId, oldHash],
  )

  return res.rowCount === 1
}

export const clearRefreshTokenHash = async (userId: string, tokenHash: string): Promise<void> => {
  await pool.query(
    `UPDATE users
     SET 
      refresh_token_hash = NULL, 
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND refresh_token_hash = $2`,
    [userId, tokenHash],
  )
}
