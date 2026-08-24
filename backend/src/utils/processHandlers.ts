import type { Server } from 'http'
import logger from '../utils/logger.js'

function shutdown(server: Server, exitCode: number) {
  logger.error('Encerrando processo após erro fatal, fechando servidor...')

  server.close(() => {
    process.exit(exitCode)
  })

  setTimeout(() => process.exit(exitCode), 10_000).unref()
}

export function registerProcessHandlers(server: Server) {
  process.on('uncaughtException', (err) => {
    logger.error('uncaughtException', {
      message: err.message,
      stack: err.stack,
    })
    shutdown(server, 1)
  })

  process.on('unhandledRejection', (reason) => {
    logger.error('unhandledRejection', { reason })
    shutdown(server, 1)
  })
}
