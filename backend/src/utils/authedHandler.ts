import type { Request, RequestHandler, Response } from "express";
import { UnauthorizedError } from "./errors.js";

export type AuthedRequest<P = unknown, B = unknown, Q = unknown> =
  Request<P, unknown, B, Q> & { userId: string }

export const authedHandler =
  <P = unknown, B = unknown, Q = unknown>(
    fn: (req: AuthedRequest<P, B, Q>, res: Response) => Promise<unknown>,
  ): RequestHandler<P, unknown, B, Q> =>
  (req, res, next) => {
    if (!req.userId) return next(new UnauthorizedError())
    fn(req as AuthedRequest<P, B, Q>, res).catch(next)
  }