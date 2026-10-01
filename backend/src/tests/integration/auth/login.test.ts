import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../../app.js'
import * as repository from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import bcrypt from 'bcrypt'
import { uuidv7 } from 'uuidv7'

describe('POST /api/v1/auth/login (integração)', () => {
  const validPayload = {
    email: 'walter@email.com',
    password: 'Senha1234',
  }

  beforeEach(async () => {
    await resetDatabase()

    // Cria o usuário padrão para os testes
    const passwordHash = await bcrypt.hash(validPayload.password, 10)
    await repository.createUser({
      id: uuidv7(),
      username: 'walter123',
      email: validPayload.email,
      passwordHash,
      refreshTokenHash: 'refresh-hash-fake',
    })
  })

  it('gera os tokens de acesso e refresh e retorna 200 junto com o accessToken', async () => {
    const response = await request(app).post('/api/v1/auth/login').send(validPayload)

    expect(response.status).toBe(200)

    expect(response.body.success).toBe(true)

    expect(response.body.data).toEqual(expect.any(String))
  })

  it('seta o cookie httpOnly de refreshToken', async () => {
    const response = await request(app).post('/api/v1/auth/login').send(validPayload)

    const cookies = response.headers['set-cookie']
    expect(cookies).toBeDefined()

    expect(cookies?.[0]).toMatch(/^refreshToken=/)

    expect(cookies?.[0]).toMatch(/HttpOnly/i)
  })

  it('retorna erro quando o email não existe', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ ...validPayload, email: 'outro@email.com' })

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })

  it('retorna erro quando a senha não bate com o email informado', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ ...validPayload, password: 'OutraSenha' })

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)
  })

  it('email é inválidado por estar vazio', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ ...validPayload, email: '' })

    expect(response.status).toBe(422)

    expect(response.body.success).toBe(false)

    // Garante que o erro veio do Zod apontando para o field "email"
    // isso é safe pq o erro do service n aponta "field" para o erro
    expect(response.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'email',
        }),
      ]),
    )
  })
})
