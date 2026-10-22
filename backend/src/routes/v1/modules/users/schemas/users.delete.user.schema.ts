import { z } from 'zod'

export const deleteUserSchema = z.object({
  password: z.string({ error: 'senha é obrigatória' }).min(1, 'senha é obrigatória'),
})

export type DeleteUserInput = z.infer<typeof deleteUserSchema>
