import { z } from "zod"

export const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username deve conter mais que 3 caractéres')
    .max(32, 'Username deve conter menos que 33 caractéres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username pode conter apenas letras, números, _ ou -')
})

export type NewUsername = z.infer<typeof updateUsernameSchema>