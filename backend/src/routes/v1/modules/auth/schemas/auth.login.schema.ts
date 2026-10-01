import { z } from 'zod'

export const loginUserSchema = z.object({
  email: z.email('Email inválido').max(255, 'O email deve ser menor que 255 caractéres'),

  password: z.string().min(1, 'Senha é obrigatória').max(72, 'Senha limite de 72 caractéres'),
})

export type LoginUserInput = z.infer<typeof loginUserSchema>
