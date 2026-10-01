import baseLogger from '../../../../utils/logger.js'
import { asyncHandler } from '../../../../utils/asyncHandler.js'
import { sendSuccess } from '../../../../utils/sendSuccess.js'
import {
  setRefreshTokenCookie,
  clearRefreshTokenHashCookie,
  REFRESH_COOKIE_NAME,
} from './auth.cookie.js'

import type { Request, Response } from 'express'
import type { RegisterUserInput } from './schemas/auth.register.schema.js'
import type { LoginUserInput } from './schemas/auth.login.schema.js'

import * as service from '../auth/auth.service.js'

//const logger = baseLogger.child({ layer: "controller"})

/*
 * req.params  → unknown
 * res.body    → unknown
 * req.body    → RegisterUserInput
 */

export const register = asyncHandler(
  async (req: Request<unknown, unknown, RegisterUserInput>, res: Response) => {
    const { user, refreshToken } = await service.registerUser(req.body)

    setRefreshTokenCookie(res, refreshToken)

    return sendSuccess(res, {
      statusCode: 201,
      data: {
        createdUser: user,
      },
    })
  },
)

export const login = asyncHandler(
  async (req: Request<unknown, unknown, LoginUserInput>, res: Response) => {
    const { accessToken, refreshToken } = await service.loginUser(req.body)

    setRefreshTokenCookie(res, refreshToken)

    return sendSuccess(res, {
      data: accessToken,
    })
  },
)

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const cookieRefreshToken: unknown = req.cookies?.[REFRESH_COOKIE_NAME]

  const { accessToken, refreshToken } = await service.refreshSession(cookieRefreshToken)

  setRefreshTokenCookie(res, refreshToken)

  return sendSuccess(res, {
    data: accessToken,
  })
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const cookieRefreshToken: unknown = req.cookies?.[REFRESH_COOKIE_NAME]

  await service.logoutUser(cookieRefreshToken)

  clearRefreshTokenHashCookie(res)

  res.sendStatus(204)
})
