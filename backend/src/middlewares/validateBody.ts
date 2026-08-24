import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'
import { ValidationError } from '../utils/errors.js'
import { formatZodError } from '../utils/zodAdapter.js'

export function validateBody(schema: z.ZodType) {
  return (req: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const issues = formatZodError(result.error.issues)

      return next(new ValidationError({ issues }))
    }

    req.body = result.data
    return next()
  }
}
