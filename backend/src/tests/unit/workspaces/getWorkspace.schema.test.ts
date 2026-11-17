import { describe, expect, it } from 'vitest'

import {
  workspaceParamsSchema
} from '../../../routes/v1/modules/workspaces/schemas/workspaces.params.js'

describe('workspaceParamsSchema', () => {

  it('aceita uuidv7', () => {
    const result = workspaceParamsSchema.safeParse({ workspaceId: '01a1c6ec-4497-7321-a2ae-9cf81b588fe7' })

    expect(result.success).toBe(true)
  })

  it('rejeita lixo', () => {
    const result = workspaceParamsSchema.safeParse({ workspaceId: 'qualquer-124' })

    expect(result.success).toBe(false)
  })
})
