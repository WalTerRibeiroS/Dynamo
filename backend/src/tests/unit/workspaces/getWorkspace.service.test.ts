import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as repository from '../../../routes/v1/modules/workspaces/workspaces.repository.js'
import { getWorkspace } from '../../../routes/v1/modules/workspaces/workspaces.service.js'
import { NotFoundError } from '../../../utils/errors.js'

vi.mock('../../../routes/v1/modules/workspaces/workspaces.repository.js')

describe('getWorkspace (service)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança NotFoundError quando o repositório não retorna os dados criados', async () => {
    vi.mocked(repository.getWorkspaceData).mockResolvedValue(undefined)

    await expect(
      getWorkspace('user-id', 'qualquer-id'),
    ).rejects.toThrow(NotFoundError)
  })
})
