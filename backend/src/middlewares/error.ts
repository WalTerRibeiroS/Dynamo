import type { ErrorRequestHandler } from 'express'
import { ENV } from '../config/env.js'
import logger from '../utils/logger.js'
import { AppError } from '../utils/errors.js'

const errorMiddleware: ErrorRequestHandler = (err, req, res, _) => {
  const isDev = ENV.NODE_ENV === 'development'

  const logContext = {
    statusCode: err instanceof AppError ? err.statusCode : 500,
    stack: err.stack,
    details: err instanceof AppError ? err.details : undefined,
    path: req.originalUrl,
    method: req.method,
  }

  if (err instanceof AppError && err.status === 'fail') {
    logger.warn(err.message, logContext)
  } else {
    logger.error(err.message, logContext)
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      code: err.code,
      message: err.message,
      ...(err.issues && { issues: err.issues }),
      ...(err.publicDetails && { publicDetails: err.publicDetails }),
      ...(isDev && { stack: err.stack }),
    })
  }

  return res.status(500).json({
    success: false,
    status: 'error',
    message: isDev ? err.message : 'Erro interno do servidor',
    ...(isDev && { stack: err.stack }),
  })
}

export default errorMiddleware
