import pool from "../../../../config/db.js"
import { mapPgError } from "../pgErrorMapper.js"
import { AppError } from "../../../../utils/errors.js"

import type { CreatedUser, CreateUserInput } from "../../../../types/user.js"

//fiz dessa maneira pq o objetivo dessa funcao é apenas verificar se o email/username existe ou n no db
//como username e email tem a constraind UNIQUE ou existe 1 ou n
export const emailExists = async (email: string): Promise<boolean> => {
  const res = await pool.query(
    `SELECT 1 FROM users WHERE email = $1`,
    [email]
  );

  return res.rows.length > 0;
};

export const usernameExists = async (username: string): Promise<boolean> => {
  const res = await pool.query(
    `SELECT 1 FROM users WHERE username = $1`,
    [username]
  );

  return res.rows.length > 0;
};

export const createUser = async(
  { 
    id, 
    username, 
    email, 
    passwordHash, 
    refreshTokenHash 
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
      [
        id, 
        username, 
        email, 
        passwordHash, 
        refreshTokenHash
      ]
    )

    return res.rows[0]

  } catch(error) {

    mapPgError(error, {
      "23505": (e) => {
        const field = e.constraint === "users_username_unique" ? "username" : "email" 
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