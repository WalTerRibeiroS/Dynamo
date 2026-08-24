import morgan from 'morgan'
import logger from '../utils/logger.js'

const morganMiddleware = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)),
      contentLength: tokens.res(req, res, 'content-length'),
      responseTimeMs: Number(tokens['response-time'](req, res)),
    })
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message)
        logger.http(`${data.method} ${data.url} ${data.status}`, data)
      },
    },
  },
)

export default morganMiddleware
