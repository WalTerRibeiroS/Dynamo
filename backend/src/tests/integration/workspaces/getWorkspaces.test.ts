import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { uuidv7 } from 'uuidv7'

import app from '../../../app.js'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import { createUser } from '../../../routes/v1/modules/auth/auth.repository.js'
import { resetDatabase } from '../../resetDatabase.js'

describe('GET /api/v1/workspaces', () => {
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

  const getWorkspaces = (token = accessToken) =>
    request(app)
      .get('/api/v1/workspaces')
      .set('Authorization', `Bearer ${token}`)

  it('retornada um array vazio quando o usuário não possui nenhum Workspace', async () => {
    const response = await getWorkspaces()

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.workspaces).toHaveLength(0)
  })

  it('retorna os dados dos dois Workspaces do usuário', async () => {
    await postWorkspace({ name: "espada"})
    await postWorkspace({ name: "estudo"})

    const response = await getWorkspaces()
    
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.workspaces).toEqual([
      {
        workspaceId: expect.any(String),
        userId: ownerId,
        workspaceName: "espada",
        colorPalette: "purple"
      },
      {
        workspaceId: expect.any(String),
        userId: ownerId,
        workspaceName: "estudo",
        colorPalette: "purple"
      }
    ])
  })
})
