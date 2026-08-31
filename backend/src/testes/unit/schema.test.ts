import { describe, it, expect } from 'vitest'
import { inserirMensagemSchema } from '../../modules/rotas_exeperimentais/schemas/teste.js'

describe('inserirMensagemSchema', () => {
  it('aceita mensagem só com letra e espaços', () => {
    const resultado = inserirMensagemSchema.safeParse({ mensagem: 'ola mundo' })
    expect(resultado.success).toBe(true)
  })

  it('rejeita mensagem com numero', () => {
    const resultado = inserirMensagemSchema.safeParse({ mensagem: 'ola123' })
    expect(resultado.success).toBe(false)
  })

  it('rejeita mensagem com caracteres especiais', () => {
    const resultado = inserirMensagemSchema.safeParse({ mensagem: 'ola!' })
    expect(resultado.success).toBe(false)
  })

  it('rejeita quando o campo de mensagem esta ausente', () => {
    const resultado = inserirMensagemSchema.safeParse({})
    expect(resultado.success).toBe(false)
  })

  it('rejeita mensagem vazia', () => {
    const resultado = inserirMensagemSchema.safeParse({ mensagem: '' })
    expect(resultado.success).toBe(false)
  })
})
