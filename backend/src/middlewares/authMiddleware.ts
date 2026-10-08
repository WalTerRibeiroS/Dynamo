import jwt from "jsonwebtoken"
import { ENV } from "../config/env.js"
import { UnauthorizedError } from "../utils/errors.js"
import { refreshTokenPayloadSchema } from "../routes/v1/modules/auth/auth.tokens.js"

import type { Request, Response, NextFunction } from "express"

export const authMiddleware = (
  req: Request, 
  _res: Response, 
  next: NextFunction
) => {
    
  const header = req.headers.authorization

  if (!header) throw new UnauthorizedError()

  const [scheme, token] = header.split(" ")

  if (scheme !== "Bearer" || !token) throw new UnauthorizedError()

  let payload: unknown

  try {
    payload = jwt.verify(token, ENV.ACCESS_TOKEN, { algorithms: ["HS256"]});
  } catch {
    throw new UnauthorizedError();
  }

  const parsed = refreshTokenPayloadSchema.safeParse(payload)

  if (!parsed.success) throw new UnauthorizedError()

  const id = parsed.data.id

  req.userId = id

  next();
};