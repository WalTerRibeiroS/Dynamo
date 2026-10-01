import { z } from 'zod'

export const registerUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username deve conter mais que 3 caractéres')
    .max(32, 'Username deve conter menos que 33 caractéres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username pode conter apenas letras, números, _ ou -'),

  email: z.email('Email inválido').max(255, 'O email deve ser menor que 255 caractéres'),

  password: z
    .string()
    .min(8, 'Senha deve conter no mínimo 8 caractéres')
    .max(72, 'Senha deve conter no máximo 72 caractéres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula'),
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>
