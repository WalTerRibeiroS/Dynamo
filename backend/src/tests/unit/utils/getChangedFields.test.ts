import { describe, expect, expectTypeOf, it } from 'vitest'
import type { UpdateWorkspaceInput } from '../../../routes/v1/modules/workspaces/schemas/workspace.update.js'
import type { WorkspaceRow } from '../../../routes/v1/modules/workspaces/workspaces.types.js'
import { getChangedFields } from '../../../utils/getChangedFields.js'

describe('getChangedFields', () => {
  
  const current = { name: 'Estudos', palette: 'purple', shortcuts: { a: 'Ctrl+K' } }

  it('retorna só os campos que mudaram', () => {
    expect(getChangedFields(current, { name: 'Novo', palette: 'purple' })).toEqual({ name: 'Novo' })
  })

  it('retorna objeto vazio quando nada mudou ou nada veio', () => {
    expect(getChangedFields(current, { name: 'Estudos' })).toEqual({})
    expect(getChangedFields(current, {})).toEqual({})
  })

  it('compara objetos por valor', () => {
    expect(getChangedFields(current, { shortcuts: { a: 'Ctrl+K' } })).toEqual({})
  })

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
