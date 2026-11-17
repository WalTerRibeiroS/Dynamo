import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { uuidv7 } from 'uuidv7'

import app from '../../../app.js'
import { issueAuthTokens } from '../../../routes/v1/modules/auth/auth.tokens.js'
import { createUser } from '../../../routes/v1/modules/auth/auth.repository.js'
import { createWorkspace } from '../../../routes/v1/modules/workspaces/workspaces.repository.js'
import { resetDatabase } from '../../resetDatabase.js'

describe('PATCH /api/v1/workspaces/:workspaceId', () => {
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

  const updateWorkspace = (workspaceId: string, body: object, token = accessToken) =>
  request(app)
    .patch(`/api/v1/workspaces/${workspaceId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(body)

  it('atualiza os dados de todos os campos corretamente', async () => {
    const response = await updateWorkspace(workspaceId, 
      {
        workspaceName: 'Estudos',
        colorPalette: 'blue'
      }
    )

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)

    expect(response.body.data.workspace).toEqual({
      workspaceName: 'Estudos',
      colorPalette: 'blue'
    })
  })

  // '01a1e43d-eb97-764b-a53d-7f341632b94b'
  it('retorna erro de not found quando o workspaceId não existe', async () => {
    const response = await updateWorkspace('01a1e43d-eb97-764b-a53d-7f341632b94b', 
      {
        workspaceName: 'Estudos',
        colorPalette: 'blue'
      }
    )

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)

    expect(response.body.code).toBe('NOT_FOUND')
  })

  it('retorna quando ambos os valores a serem atualizados são os mesmos que já estão no banco', async () => {
    const response = await updateWorkspace(workspaceId, 
      {
        workspaceName: 'Teste',
        colorPalette: 'black'
      }
    )

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.workspace).toEqual({
      workspaceName: 'Teste',
      colorPalette: 'black'
    })
  })

  it('atualiza corretamente quando quer mudar um campo apenas', async () => {
    const response = await updateWorkspace(workspaceId, 
      {
        workspaceName: 'Estudos'
      }
    )

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)

    expect(response.body.data.workspace).toEqual({
      workspaceName: 'Estudos',
      colorPalette: 'black'
    })
  })

  it('não aceita campos com undefined ou null em ambos os campos', async () => {
    const firstResponse = await updateWorkspace(workspaceId, 
      {
        workspaceName: undefined,
        colorPalette: undefined
      }
    )

    const secondResponse = await updateWorkspace(workspaceId, 
      {
        workspaceName: null,
        colorPalette: null
      }
    )

    expect(firstResponse.status).toBe(422)
    expect(firstResponse.body.success).toBe(false)

    expect(secondResponse.status).toBe(422)
    expect(secondResponse.body.success).toBe(false)
  })

  it('não aceita campos com valores inválidos', async () => {
    const firstResponse = await updateWorkspace(workspaceId, 
      {
        workspaceName: '',
      }
    )

    const secondResponse = await updateWorkspace(workspaceId, 
      {
        colorPalette: 'roxo'
      }
    )

    expect(firstResponse.status).toBe(422)
    expect(firstResponse.body.success).toBe(false)

    expect(secondResponse.status).toBe(422)
    expect(secondResponse.body.success).toBe(false)
  })

  it('durante a atualização do workspaceName se esse nome estiver em uso retorna erro de conflito', async () => {

    // outro workspace
    await createWorkspace({
      workspaceId: '01a1e4bf-820a-7509-bab9-f526eb4c0639',
      userId: userId,
      name: "Nome muito legal",
      colorPalette: "blue",
    })

    const response = await updateWorkspace(workspaceId, 
      {
        workspaceName: "Nome muito legal",
        colorPalette: 'blue'
      }
    )

    expect(response.status).toBe(409)
    expect(response.body.success).toBe(false)

    expect(response.body.code).toBe('DATABASE_CONFLIT')
    expect(response.body.issues[0].field).toBe('workspaceName')
    expect(response.body.issues[0].code).toBe('WORKSPACE_NAME_ALREADY_EXISTS')
  })
})