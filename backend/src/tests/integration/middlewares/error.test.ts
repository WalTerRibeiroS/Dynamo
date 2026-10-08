import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import errorMiddleware from '../../../middlewares/error.js'
import { AppError } from '../../../utils/errors.js'

function createAppThatThrows(error: Error) {
  const app = express()

  app.get('/error', (_req, _res, next) => {
    next(error)
  })

  app.use(errorMiddleware)

  return app
}

describe('errorMiddleware', () => {
  it('esconde a mensagem e a stack de erros inesperados', async () => {
    const app = createAppThatThrows(new Error('detalhe interno'))

    const response = await request(app).get('/error')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      success: false,
      status: 'error',
      message: 'Erro interno do servidor',
    })
    expect(response.body).not.toHaveProperty('stack')
  })

  it('retorna publicDetails, mas não expõe details internos', async () => {
    const error = new AppError({
      message: 'Username já está em uso',
      statusCode: 409,
      code: 'DUPLICATE_FIELD',
      publicDetails: { field: 'username' },
      details: { password: 'dado privado' },
    })
    const app = createAppThatThrows(error)

    const response = await request(app).get('/error')

    expect(response.status).toBe(409)
    expect(response.body).toMatchObject({
      success: false,
      status: 'fail',
      code: 'DUPLICATE_FIELD',
      message: 'Username já está em uso',
      publicDetails: { field: 'username' },
    })
    expect(response.body).not.toHaveProperty('details')
    expect(response.body).not.toHaveProperty('stack')
  })
})