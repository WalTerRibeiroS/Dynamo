import { describe, expect, it } from 'vitest'

import {
  updateWorkspaceSchema,
} from '../../../routes/v1/modules/workspaces/schemas/workspace.update.js'

// n testei a formatação mais básica de inputs pq elas são as mesmas e ja foram testadas em outros testes de schemas 

describe('updateWorkspaceSchema', () => {
  it('rejeita quando não é recebido nenhum cambo', () => {
    const result = updateWorkspaceSchema.safeParse({ workspaceName: undefined, colorPalette: undefined })

    expect(result.success).toBe(false)    
  })

  it('aceita quando ao menos um campo está preenchido corretamente', () => {
    const result = updateWorkspaceSchema.safeParse({ workspaceName: undefined, colorPalette: 'black' })

    expect(result.success).toBe(true)    
  })

  it('aceita valores válidos', () => {
    const result = updateWorkspaceSchema.safeParse({ workspaceName: 'Psicologia', colorPalette: 'black' })

    expect(result.success).toBe(true)    
  })
})
