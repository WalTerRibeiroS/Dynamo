import baseLogger from "../../../../utils/logger.js"
import { asyncHandler } from "../../../../utils/asyncHandler.js"
import { sendSuccess } from "../../../../utils/sendSuccess.js"
import { ENV } from "../../../../config/env.js"

import type { Request, Response } from "express"
import type { RegisterUserInput } from "./schemas/auth.register.schema.js"

import * as service from "../auth/auth.service.js"

const logger = baseLogger.child({ layer: "controller"})

export const register = asyncHandler(async(req: Request<unknown, unknown, RegisterUserInput>, res: Response) => {

  logger.info("entrou")

  const { user, refreshToken } = await service.registerUser(req.body)

  const isProd = ENV.NODE_ENV === "production";
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/v1/auth/refresh",
  });

  logger.info("saiu")

  return sendSuccess(res, {
    statusCode: 201,
    data: {
      createdUser: user
    }
  })
})