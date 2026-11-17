import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { uuidv7 } from 'uuidv7'

import app from '../../../app.js'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import { createUser } from '../../../routes/v1/modules/auth/auth.repository.js'
import { createWorkspace } from '../../../routes/v1/modules/workspaces/workspaces.repository.js'

import { resetDatabase } from '../../resetDatabase.js'

describe('GET /api/v1/workspaces/:workspaceId', () => {
  const userId = uuidv7()
  const workspaceId = uuidv7()
  const { accessToken, refreshTokenHash } = issueAuthTokens(userId)

  beforeEach(async () => {
    await resetDatabase()

    await createUser({
      id: userId,
      username: 'walter123',
      email: 'walter@email.com',
      passwordHash: 'senha-fake',
      refreshTokenHash,
    })

    await createWorkspace({
      workspaceId: workspaceId,
      userId: userId,
      name: "Teste",
      colorPalette: "black",
    })
  })

  const getWorkspace = (workspaceId: string, token = accessToken) =>
    request(app)
      .get(`/api/v1/workspaces/${workspaceId}`)
      .set('Authorization', `Bearer ${token}`)


  it('retorna os dados corretos esperados do workspace', async () => {
    const response = await getWorkspace(workspaceId)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.workspace).toEqual({
      colorPalette: 'black',
      workspaceName: 'Teste',
      zoom: 1,
      cameraX: 0,
      cameraY: 0,
      isEditMode: true,
    })
  })

  it('retorna erro de validação quando o workspaceId vem mal formatado', async () => {
    const response = await getWorkspace('qualquer-bomba')

    expect(response.status).toBe(422)
    expect(response.body.success).toBe(false)
    expect(response.body.code).toBe('VALIDATION_ERROR')
  })

  it('retorna erro NOT_FOUND quando o id dentro do token de acesso não existe', async () => {

    const { accessToken } = issueAuthTokens('01a1cbad-a478-7452-b58b-b53105fccb24')

    const response = await getWorkspace(workspaceId, accessToken)

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.code).toBe('NOT_FOUND')
  })

  it('retorna erro NOT_FOUND quando o workspaceId não existe', async () => {
    const response = await getWorkspace('01a1cbad-a478-7452-b58b-b53105fccb24')

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.code).toBe('NOT_FOUND')
  })
})