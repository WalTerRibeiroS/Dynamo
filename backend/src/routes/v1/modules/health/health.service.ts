import { ENV } from '../../../../config/env.js'

export type HealthStatus = {
  readonly status: 'ok'
  readonly environment: string
  readonly timestamp: string
}

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  }
}
