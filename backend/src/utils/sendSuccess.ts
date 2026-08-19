import type { Response } from "express"
import type { ApiSuccess } from "../types/apiResponse.js"
import type { SendSuccessOptions } from "../types/sendSuccessOptions.js"

export function sendSuccess<T>(res: Response, options: SendSuccessOptions<T>){
  const {
    statusCode = 200,
    data,
    message
  } = options

  return res.status(statusCode).json({
    success: true,
    status: "success",
    data,
    ...(message && { message })
  } satisfies ApiSuccess<T>)
}