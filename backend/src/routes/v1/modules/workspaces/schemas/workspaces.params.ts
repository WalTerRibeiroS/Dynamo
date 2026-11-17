import { z } from 'zod'

export const workspaceParamsSchema = z.object({
  workspaceId: z.uuidv7(),
})

export type WorkspaceParams = z.infer<typeof workspaceParamsSchema>