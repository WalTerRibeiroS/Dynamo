import type { Response } from "express"
import type { ApiSuccess } from "../types/apiResponse.js"

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200){
  return res.status(statusCode).json({
    success: true,
    status: "success",
    data,
    ...(message ? { message } : {})
  } satisfies ApiSuccess<T>)
}