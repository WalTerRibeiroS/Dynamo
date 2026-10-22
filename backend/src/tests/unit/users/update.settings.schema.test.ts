import { describe, expect, it } from 'vitest'
import { updateSettingsSchema } from '../../../routes/v1/modules/users/schemas/users.update.settings.schema.js'

describe('updateSettingsSchema', () => {
  it.each(['light', 'dark', 'system'])('aceita o tema %s', (theme) => {
    const result = updateSettingsSchema.safeParse({ theme })
    expect(result.success).toBe(true)
  })

  it('rejeita um tema não suportado', () => {
    const result = updateSettingsSchema.safeParse({ theme: 'blue' })
    expect(result.success).toBe(false)
  })

  it('rejeita tema ausente', () => {
    const result = updateSettingsSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
