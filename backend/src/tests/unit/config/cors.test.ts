
import { describe, expect, it } from 'vitest'
import { corsOrigins } from '../../../config/cors.js'
import { ENV } from '../../../config/env.js'

// tive que recriar esse tipo do cors pq eu n conseguia exportar ele
// e eu precisava dele

type StaticOrigin = boolean | string | RegExp | Array<boolean | string | RegExp>

function checkOrigin(origin: string | undefined) {
  return new Promise<{ error: Error | null; allowed?: StaticOrigin | undefined }>((resolve) => {
    const originOption = corsOrigins.origin

    if (typeof originOption !== 'function') {
      throw new Error('A configuração de CORS deveria usar uma função para origin')
    }

    originOption(origin, (error, allowed) => {
      resolve({ error, allowed })
    })
  })
}

describe('corsOrigins', () => {
  it('aceita a origem do frontend configurado', async () => {
    await expect(checkOrigin(ENV.FRONTEND_URL)).resolves.toEqual({
      error: null,
      allowed: true,
    })
  })

  it('aceita requisições sem Origin', async () => {
    await expect(checkOrigin(undefined)).resolves.toEqual({
      error: null,
      allowed: true,
    })
  })

  it('recusa uma origem não configurada', async () => {
    const result = await checkOrigin('https://origem-nao-permitida.example')

    expect(result.allowed).toBeUndefined()
    expect(result.error).toBeInstanceOf(Error)
    expect(result.error?.message).toBe('Bloqueado pelo CORS')
  })

  it('permite credenciais', () => {
    expect(corsOrigins.credentials).toBe(true)
  })
})