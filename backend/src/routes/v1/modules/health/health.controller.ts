import { asyncHandler } from '../../../../utils/asyncHandler.js'
import { sendSuccess } from '../../../../utils/sendSuccess.js'
import * as service from './health.service.js'

import type { Request, Response } from 'express'

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const healthStatus = service.getHealthStatus()

  return sendSuccess(res, {
    data: healthStatus,
  })
})
