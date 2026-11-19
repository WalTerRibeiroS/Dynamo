import { describe, it, expect, beforeEach } from 'vitest'
import { uuidv7 } from 'uuidv7'
import { createUser } from '../../../routes/v1/modules/auth/auth.repository.js'
import { createWorkspace, updateWorkspace } from '../../../routes/v1/modules/workspaces/workspaces.repository.js'
import { resetDatabase } from '../../resetDatabase.js'
import pool from '../../../config/db.js'
import type { WorkspaceSummary } from '../../../routes/v1/modules/workspaces/workspaces.types.js'

describe('updateWorkspace', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  const idFake = uuidv7()
  const workspaceId = uuidv7()

  const userFake = {
    id: idFake,
    username: 'walter123',
    email: 'walter@email.com',
    passwordHash: 'hash-fake-123',
    refreshTokenHash: 'refresh-hash-inicial',
  }

  const workspaceFake: WorkspaceSummary = {
    workspaceName: 'string',
    colorPalette: "black",
    workspaceId: workspaceId,
    userId: idFake,
  }

  it('retorna os dados atualizados', async () => {
    await createUser(userFake)
    await createWorkspace(workspaceFake)

    const updatedData = await updateWorkspace(workspaceFake.workspaceId, workspaceFake.userId, {
      workspaceName: 'Walter'
    })

    expect(updatedData).toEqual({ colorPalette: 'black', workspaceName: 'Walter'  })
  })


  it('atualiza updated_at junto com o resto dos dados', async () => {
    await createUser(userFake)
    await createWorkspace(workspaceFake)

    const timestampAntigo = new Date('2000-01-01T00:00:00.000Z')

    await pool.query(`UPDATE workspaces SET updated_at = $1 WHERE user_id = $2 AND workspace_id = $3`, [timestampAntigo, idFake, workspaceId])

    await updateWorkspace(workspaceFake.workspaceId, workspaceFake.userId, {
      workspaceName: 'Walter'
    })

    const { rows } = await pool.query<{ updatedAt: Date }>(
      `SELECT updated_at AS "updatedAt" FROM users WHERE id = $1`,
      [idFake],
    )

    expect(rows[0]?.updatedAt.getTime()).toBeGreaterThan(timestampAntigo.getTime())
  })
  
})
