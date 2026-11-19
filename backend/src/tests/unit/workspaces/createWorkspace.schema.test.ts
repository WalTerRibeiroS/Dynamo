import { describe, expect, it } from 'vitest'

import {
  createWorkspaceSchema,
} from '../../../routes/v1/modules/workspaces/schemas/workspaces.create.js'
import { WORKSPACE_COLOR_PALETTES } from '../../../routes/v1/modules/workspaces/workspaces.constants.js'

describe('createWorkspaceSchema', () => {
  it('trims o nome e usa a paleta padrão quando ela é omitida', () => {
    const result = createWorkspaceSchema.safeParse({ workspaceName: '  Estudos  ' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ workspaceName: 'Estudos', colorPalette: 'purple' })
    }
  })

  it('aceita nomes com até 50 caracteres após aparar espaços', () => {
    const result = createWorkspaceSchema.safeParse({ workspaceName: ` ${'a'.repeat(50)} ` })

    expect(result.success).toBe(true)
  })

  it('rejeita nome vazio após aparar espaços', () => {
    const result = createWorkspaceSchema.safeParse({ workspaceName: '   ' })

    expect(result.success).toBe(false)
  })

  it('rejeita nomes com mais de 50 caracteres após aparar espaços', () => {
    const result = createWorkspaceSchema.safeParse({ workspaceName: 'a'.repeat(51) })

    expect(result.success).toBe(false)
  })

  it('rejeita paletas não permitidas', () => {
    const result = createWorkspaceSchema.safeParse({ workspaceName: 'Estudos', colorPalette: 'orange' })

    expect(result.success).toBe(false)
  })

  it('aceita todas as paletas permitidas', () => {
    for (const colorPalette of WORKSPACE_COLOR_PALETTES) {
      const result = createWorkspaceSchema.safeParse({ workspaceName: 'Estudos', colorPalette })
      expect(result.success).toBe(true)
    }
  })

  it('descarta workspaceId e userId enviados pelo cliente', () => {
    const result = createWorkspaceSchema.safeParse({
      workspaceName: 'Estudos',
      workspaceId: 'client-workspace-id',
      userId: 'client-user-id',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ workspaceName: 'Estudos', colorPalette: 'purple' })
    }
  })
})
