import { DatabaseError } from 'pg'
import { AppError } from '../utils/errors.js'

export type PgErrorCode =
  | '23505' // unique_violation
  | '23503' // foreign_key_violation
  | '23514' // check_violation

export type PgErrorMap = Partial<Record<PgErrorCode, (error: DatabaseError) => AppError>>
//map de codigos SQLSTATE : função que recebe 'DatabaseError' e transforma em 'AppError'
