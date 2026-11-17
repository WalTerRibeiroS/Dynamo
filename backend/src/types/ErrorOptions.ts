import type { Issue } from './issue.js'

export type ErrorOptions = {
  issues?: Issue[]
  publicDetails?: Record<string, unknown>
  message?: string
}

//public details, timeout, ratelimiting, <motivo, informacao adicional q pode ser usado como logica pelo front>