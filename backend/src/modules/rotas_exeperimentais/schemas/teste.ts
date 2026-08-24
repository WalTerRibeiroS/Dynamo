import { z } from 'zod'

export const inserirMensagemSchema = z.object({
  mensagem: z.string().regex(/^[a-zA-Z\s]+$/, 'só é aceito letras de A-Z'),
})

export type Texto = z.infer<typeof inserirMensagemSchema>
