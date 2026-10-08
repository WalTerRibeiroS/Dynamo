import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createLimiter } from '../../../middlewares/createLimiter.js'
import errorMiddleware from '../../../middlewares/error.js'

describe('createLimiter', () => {
  it('retorna 429 e RATE_LIMITED ao exceder o limite', async () => {
    const app = express()

    app.use(
      '/limited',
      createLimiter({
        windowMs: 60_000,
        limit: 1,
      }),
    )

    app.get('/limited', (_req, res) => {
      res.sendStatus(204)
    })

    app.use(errorMiddleware)

    const firstResponse = await request(app).get('/limited')
    const secondResponse = await request(app).get('/limited')

    expect(firstResponse.status).toBe(204)

    expect(secondResponse.status).toBe(429)
    expect(secondResponse.body).toMatchObject({
      success: false,
      status: 'fail',
      code: 'RATE_LIMITED',
    })
    expect(secondResponse.body.publicDetails.retryAfter).toEqual(
      expect.any(Number),
    )
    expect(secondResponse.body.publicDetails.retryAfter).toBeGreaterThanOrEqual(1)
  })
})