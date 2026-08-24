import app from './app.js'
import { ENV } from './config/env.js'
import logger from './utils/logger.js'
import { registerProcessHandlers } from './utils/processHandlers.js'

const server = app.listen(ENV.PORT, () =>
  logger.info(`A manivele esta rodando na porta ${ENV.PORT}...`),
)
registerProcessHandlers(server)
