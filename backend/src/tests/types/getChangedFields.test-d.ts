import { describe, expect, expectTypeOf, it } from 'vitest'
import type { WorkspaceRow } from '../../routes/v1/modules/workspaces/workspaces.types.js'
import type { UpdateWorkspaceInput } from '../../routes/v1/modules/workspaces/schemas/workspace.update.js'
import { getChangedFields, type Changed } from '../../utils/getChangedFields.js'

describe('getChangedFields', () => {
  
  const current = { name: 'Estudos', palette: 'purple', shortcuts: { a: 'Ctrl+K' } }

  it('aceita propriedades com undefined e retorna um tipo sem undefined', () => {
    const currentWorkspace: Pick<WorkspaceRow, 'workspaceName' | 'colorPalette'> = {
      workspaceName: 'Estudos',
      colorPalette: 'purple',
    }
    const patch: UpdateWorkspaceInput = {
      workspaceName: 'Novo nome',
      colorPalette: undefined,
    }

    const changes = getChangedFields(currentWorkspace, patch)

    expect(changes).toEqual({ workspaceName: 'Novo nome' })
    expectTypeOf(changes).toEqualTypeOf<{
      workspaceName?: string
      colorPalette?: WorkspaceRow['colorPalette']
    }>()
  })

  it('ignora um campo cujo único valor recebido é undefined', () => {
    const patch: { name: string | undefined } = { name: undefined }
    const changes = getChangedFields(current, patch)

    expect(changes).toEqual({})
    expectTypeOf(changes).toEqualTypeOf<{ name?: string }>()
  })

  it('retira o undefined do tipo das propriedades', () => {
    type UndefinedProperties = {
      name: string | undefined
    }

    const patch: UndefinedProperties = {
      name: 'Walter'
    }

    const changes = getChangedFields(current, patch)

    expect(changes).toEqual({ name: 'Walter' })
    expectTypeOf(changes).toEqualTypeOf<{ name?: string }>()
  })
})