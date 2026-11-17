import { describe, expect, it } from "vitest"
import { getChangedFields } from "../../../utils/getChangedFields.js"

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
})