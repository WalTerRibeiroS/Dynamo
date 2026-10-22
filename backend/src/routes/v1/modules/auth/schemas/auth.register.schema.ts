import { z } from 'zod'
import validator from 'validator'

export const registerUserSchema = z.object({
  username: z
    .string({ error: 'Username é obrigatória' })
    .min(3, 'Username deve conter mais que 3 caractéres')
    .max(32, 'Username deve conter menos que 33 caractéres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username pode conter apenas letras, números, _ ou -'),

  email: z
    .string()
    .refine(validator.isEmail, 'E-mail inválido')
    .max(255, 'O email deve ser menor que 255 caractéres'),

  password: z
    .string({ error: 'Senha é obrigatória' })
    .min(8, 'Senha deve conter no mínimo 8 caractéres')
    .refine(
      (password) => Buffer.from(password, 'utf8').length <= 72,
      'A senha deve ter no máximo 72 bytes em UTF-8',
    )
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula'),
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>
