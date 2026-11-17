import { DatabaseError } from 'pg'

export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError
}