import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as repository from '../../../routes/v1/modules/workspaces/workspaces.repository.js'
import { createWorkspace } from '../../../routes/v1/modules/workspaces/workspaces.service.js'
import { NotFoundError } from '../../../utils/errors.js'

vi.mock('../../../routes/v1/modules/workspaces/workspaces.repository.js')

describe('createWorkspace (service)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança NotFoundError quando o repositório não retorna os dados criados', async () => {
    vi.mocked(repository.createWorkspace).mockResolvedValue(undefined)

    await expect(
      createWorkspace('user-id', { workspaceName: 'Estudos', colorPalette: 'purple' }),
    ).rejects.toThrow(NotFoundError)
  })
})
