import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { uuidv7 } from 'uuidv7'

import app from '../../../app.js'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import { createUser } from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'

describe('POST /api/v1/workspaces', () => {
  const ownerId = uuidv7()
  const { accessToken, refreshTokenHash } = issueAuthTokens(ownerId)

  beforeEach(async () => {
    await resetDatabase()

    await createUser({
      id: ownerId,
      username: 'walter123',
      email: 'walter@email.com',
      passwordHash: 'senha-fake',
      refreshTokenHash,
    })
  })

  const postWorkspace = (body: object, token = accessToken) =>
    request(app)
      .post('/api/v1/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .send(body)

  it('cria e retorna o Workspace completo com os valores iniciais', async () => {
    const response = await postWorkspace({ name: '  Estudos  ' })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data.workspace).toEqual({
      workspaceId: expect.any(String),
      userId: ownerId,
      workspaceName: 'Estudos',
      zoom: 1,
      cameraX: 0,
      cameraY: 0,
      colorPalette: 'purple',
      isEditMode: true,
    })
  })

  it('usa o workspaceId do backend e o usuário autenticado, ignorando workspaceId e userId do corpo', async () => {
    const response = await postWorkspace({
      name: 'Estudos',
      workspaceId: '01a15562-1251-766d-b174-cc96982911fe',
      userId: '01a15562-1251-766d-b174-cc96982911fe',
    })

    expect(response.status).toBe(201)
    expect(response.body.data.workspace.workspaceId).not.toBe('01a15562-1251-766d-b174-cc96982911fe')
    expect(response.body.data.workspace.userId).toBe(ownerId)
  })

  it('rejeita requisição sem autenticação', async () => {
    const response = await request(app).post('/api/v1/workspaces').send({ name: 'Estudos' })

    expect(response.status).toBe(401)
    expect(response.body.code).toBe('UNAUTHORIZED')
  })

  it('retorna não encontrado quando o usuário do token não existe no banco', async () => {
    const { accessToken: tokenForMissingUser } = issueAuthTokens(uuidv7())
    const response = await postWorkspace({ name: 'Estudos' }, tokenForMissingUser)

    expect(response.status).toBe(404)
    expect(response.body.code).toBe('NOT_FOUND')
  })

  it('rejeita nome vazio, nome acima do limite e paleta inválida', async () => {
    const emptyName = await postWorkspace({ name: '   ' })
    const longName = await postWorkspace({ name: 'a'.repeat(51) })
    const invalidPalette = await postWorkspace({ name: 'Estudos', colorPalette: 'orange' })

    expect(emptyName.status).toBe(422)
    expect(longName.status).toBe(422)
    expect(invalidPalette.status).toBe(422)
    expect(emptyName.body).toMatchObject({
      code: 'VALIDATION_ERROR',
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'MIN_LENGTH', field: 'name' }),
      ]),
    })
    expect(longName.body).toMatchObject({
      code: 'VALIDATION_ERROR',
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'MAX_LENGTH', field: 'name' }),
      ]),
    })
    expect(invalidPalette.body).toMatchObject({
      code: 'VALIDATION_ERROR',
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'INVALID_VALUE', field: 'colorPalette' }),
      ]),
    })
  })

  it('rejeita nome repetido sem diferenciar maiúsculas e minúsculas', async () => {
    const first = await postWorkspace({ name: 'Estudos de TypeScript' })
    const duplicate = await postWorkspace({ name: '  ESTUDOS DE TYPESCRIPT  ' })

    expect(first.status).toBe(201)
    expect(duplicate.status).toBe(409)
    expect(duplicate.body).toMatchObject({
      code: 'DATABASE_CONFLIT',
      issues: expect.arrayContaining([
        expect.objectContaining({
          code: 'WORKSPACE_NAME_ALREADY_EXISTS',
          field: 'workspaceName',
        }),
      ]),
    })
  })

  it('permite que usuários diferentes criem Workspaces com o mesmo nome', async () => {
    const otherUserId = uuidv7()
    const { accessToken: otherAccessToken, refreshTokenHash: otherRefreshTokenHash } =
      issueAuthTokens(otherUserId)

    await createUser({
      id: otherUserId,
      username: 'outro123',
      email: 'outro@email.com',
      passwordHash: 'senha-fake',
      refreshTokenHash: otherRefreshTokenHash,
    })

    const first = await postWorkspace({ name: 'Estudos' })
    const second = await postWorkspace({ name: 'Estudos' }, otherAccessToken)

    expect(first.status).toBe(201)
    expect(second.status).toBe(201)
    expect(second.body.data.workspace.userId).toBe(otherUserId)
  })

  it('retorna conflito ao tentar criar o sexto Workspace', async () => {
    for (let index = 1; index <= 5; index += 1) {
      const response = await postWorkspace({ name: `Workspace ${index}` })
      expect(response.status).toBe(201)
    }

    const sixthWorkspace = await postWorkspace({ name: 'Workspace 6' })

    expect(sixthWorkspace.status).toBe(409)
    expect(sixthWorkspace.body).toMatchObject({
      code: 'DATABASE_CONFLIT',
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'WORKSPACE_LIMIT_REACHED' }),
      ]),
    })
    expect(sixthWorkspace.body.issues[0]).not.toHaveProperty('field')
  })

  it('o trigger impede criações simultâneas de ultrapassarem o limite', async () => {
    for (let index = 1; index <= 4; index += 1) {
      const response = await postWorkspace({ name: `Workspace ${index}` })
      expect(response.status).toBe(201)
    }

    const responses = await Promise.all([
      postWorkspace({ name: 'Workspace 5A' }),
      postWorkspace({ name: 'Workspace 5B' }),
    ])

    expect(responses.map(({ status }) => status).sort()).toEqual([201, 409])
    const conflictResponse = responses.find(({ status }) => status === 409)
    expect(conflictResponse?.body).toMatchObject({
      code: 'DATABASE_CONFLIT',
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'WORKSPACE_LIMIT_REACHED' }),
      ]),
    })
    expect(conflictResponse?.body.issues[0]).not.toHaveProperty('field')
  })

  it('o índice único rejeita criações simultâneas com nomes equivalentes', async () => {
    const responses = await Promise.all([
      postWorkspace({ name: 'Estudos' }),
      postWorkspace({ name: 'ESTUDOS' }),
    ])

    expect(responses.map(({ status }) => status).sort()).toEqual([201, 409])
    expect(responses.find(({ status }) => status === 409)?.body).toMatchObject({
      code: 'DATABASE_CONFLIT',
      issues: expect.arrayContaining([
        expect.objectContaining({
          code: 'WORKSPACE_NAME_ALREADY_EXISTS',
          field: 'workspaceName',
        }),
      ]),
    })
  })
})
