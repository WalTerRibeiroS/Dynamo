import { describe, expect, it, vi } from 'vitest'

import pool from '../../../config/db.js'
import { createWorkspace } from '../../../routes/v1/modules/workspaces/workspaces.repository.js'

vi.mock('../../../config/db.js', () => ({
  default: {
    query: vi.fn(async () => ({
      command: 'INSERT',
      rowCount: 0,
      oid: 0,
      fields: [],
      rows: [],
    })),
  },
}))

describe('createWorkspace (repository)', () => {
  it('retorna undefined quando o INSERT não retorna nenhuma linha', async () => {
    const result = await createWorkspace({
      workspaceId: 'workspace-id',
      userId: 'user-id',
      workspaceName: 'Estudos',
      colorPalette: 'purple',
    })

    expect(result).toBeUndefined()
    expect(pool.query).toHaveBeenCalledOnce()
  })
})
