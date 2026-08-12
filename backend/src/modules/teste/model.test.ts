import pool from "../../config/db.js"

export const dbTeste = async (mensagem: string) => {
  const result = await pool.query(
    `INSERT INTO teste (mensagem)
      VALUES ($1)
      RETURNING *`,

    [mensagem]
  )
  return result.rows[0]
}