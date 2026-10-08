import baseLogger from '../../../../utils/logger.js'
import { asyncHandler } from '../../../../utils/asyncHandler.js'
import { sendSuccess } from '../../../../utils/sendSuccess.js'
import { UnauthorizedError } from '../../../../utils/errors.js'

import type { Request, Response } from 'express'

import * as service from './users.service.js'
import type { NewUsername } from './schemas/users.update.schema.js'

const logger = baseLogger.child({ layer: "controller"})

export const me = asyncHandler(
  async(req: Request, res: Response) => {
    logger.info("Entrei")

    if (!req.userId) throw new UnauthorizedError()

    const userData = await service.getUserData(req.userId)

    logger.info("sai")
    return sendSuccess(res, {
      data: userData
    })
  }
) 

export const updateUsername = asyncHandler(
  async(req: Request<unknown, unknown, NewUsername>, res: Response) => {
    logger.info("Entrei")

    if (!req.userId) throw new UnauthorizedError()

    const newUsername = req.body.username

    const registeredNewUsername = await service.registerNewUsername(req.userId, newUsername)

    logger.info("sai")
    return sendSuccess(res, {
      data: updatedUserData
    })
  }
) 