import { describe, it, expect } from 'vitest'
import { getHealthStatus } from '../../../routes/v1/modules/health/health.service.js'
import { ENV } from '../../../config/env.js'

describe('getHealthStatus (unidade)', () => {
  it('retorna o status, environment e timestamp em formato ISO', () => {
    const before = new Date().getTime()
    const result = getHealthStatus()
    const after = new Date().getTime()

    expect(result.status).toBe('ok')
    expect(result.environment).toBe(ENV.NODE_ENV)
    expect(typeof result.timestamp).toBe('string')

    const parsedTimestamp = new Date(result.timestamp).getTime()
    expect(Number.isNaN(parsedTimestamp)).toBe(false)
    expect(parsedTimestamp).toBeGreaterThanOrEqual(before)
    expect(parsedTimestamp).toBeLessThanOrEqual(after)
  })
})
