import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../../app.js'
import { ENV } from '../../../config/env.js'

describe('GET /api/v1/health (integração)', () => {
  it('retorna 200 com status, environment e timestamp', async () => {
    const response = await request(app).get('/api/v1/health')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      success: true,
      status: 'success',
      data: {
        status: 'ok',
        environment: ENV.NODE_ENV,
        timestamp: expect.any(String),
      },
    })

    const parsedDate = new Date(response.body.data.timestamp)
    expect(Number.isNaN(parsedDate.getTime())).toBe(false)
  })
})
