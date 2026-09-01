import pool from "../../../../config/db.js"

export const getUserByEmail = async(email: string) => {
  const res = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `, [email]
  )
  return res.rows[0]
}

export const getUserByUsername = async(username: string) => {
  const res = await pool.query(
    `
    SELECT * FROM users WHERE username=$1
    `, [username]
  )
  return res.rows[0]
}

export const createUser = async(
  id: string, 
  username: string, 
  email: string,
  password_hash: string,
  refreshTokenHash: string
) => {
  const res = await pool.query(
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
    RETURNING*    
    `, 
    [
      id, 
      username, 
      email, 
      password_hash, 
      refreshTokenHash
    ]
  )
  return res.rows[0]
}