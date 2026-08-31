import { describe, it, expect, vi, beforeEach } from 'vitest'
import { serviceTest } from '../../modules/rotas_exeperimentais/service.js'
import { dbTeste } from '../../modules/rotas_exeperimentais/model.js'
import { ValidationError } from '../../utils/errors.js'

vi.mock('../../modules/rotas_exeperimentais/model.js', () => ({
  dbTeste: vi.fn(),
}))

describe('serviceTest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança ValidationError se o texto tiver menos de 3 caracteres', async () => {
    await expect(serviceTest('ab')).rejects.toThrow(ValidationError)
    expect(dbTeste).not.toHaveBeenCalled()
  })

  it('chama dbTeste com o texto e retorna a mensagem quando valido', async () => {
    vi.mocked(dbTeste).mockResolvedValue({ mensagem: 'oi mundo' })

    const resultado = await serviceTest('oi mundo')

    expect(resultado).toBe('oi mundo')
    expect(dbTeste).toHaveBeenCalledWith('oi mundo')
    expect(dbTeste).toHaveBeenCalledTimes(1)
  })
})
