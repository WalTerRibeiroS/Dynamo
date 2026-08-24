import { createLogger, addColors, transports, format } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { ENV } from '../config/env.js'

const { combine, timestamp, printf, colorize, json, errors, prettyPrint } = format

const config = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'grey',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'magenta',
  },
}

addColors(config.colors)

const isProduction = ENV.NODE_ENV === 'production'

const logger = createLogger({
  levels: config.levels,
  level: isProduction ? 'http' : 'debug',
  format: combine(errors({ stack: true }), timestamp({ format: 'DD-MM-YYYY | HH:mm:ss' })),
  transports: [
    new transports.Console({
      format: isProduction
        ? json()
        : combine(
            colorize(),
            printf(
              ({ timestamp, level, message, ...meta }) =>
                `[${timestamp} - ${level}] : ${message} ${
                  Object.keys(meta).length ? JSON.stringify(meta) : ''
                }`,
            ),
          ),
    }),
  ],
})

const fileRotateTransport = new DailyRotateFile({
  level: 'error',
  filename: 'logs/aplicacao-%DATE%.log',
  datePattern: 'DD-MM-YYYY',
  zippedArchive: true,
  maxSize: '5m',
  maxFiles: '3d',
  format: combine(errors({ stack: true }), timestamp(), prettyPrint()),
})

logger.add(fileRotateTransport)

export default logger
