import validator from 'validator';
import { z } from 'zod'

export const loginUserSchema = z.object({
  email: z.string().refine(validator.isEmail, "E-mail inválido").max(255, 'O email deve ser menor que 255 caractéres'),

  password: z
  .string().min(1, 'Senha é obrigatória')
  .refine(
    (password) => Buffer.from(password, "utf8").length <= 72,
    "A senha deve ter no máximo 72 bytes em UTF-8"
  )
})

export type LoginUserInput = z.infer<typeof loginUserSchema>
