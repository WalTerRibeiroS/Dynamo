import { z } from 'zod'

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string({ error: 'senha atual é obrigatória' })
    .min(1, 'Senha atual é obrigatória'),

  newPassword: z
    .string({ error: 'senha nova é obrigatória' })
    .min(8, 'Senha deve conter no mínimo 8 caractéres')
    .refine(
      (password) => Buffer.from(password, 'utf8').length <= 72,
      'A senha deve ter no máximo 72 bytes em UTF-8',
    )
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula'),
})

export type ChangePasswordInput = z.infer<typeof updatePasswordSchema>
