import { z } from 'zod'
import { DEFAULT_WORKSPACE_COLOR_PALETTE, WORKSPACE_COLOR_PALETTES } from '../workspaces.constants.js'

export const createWorkspaceSchema = z.object({
  workspaceName: z
    .string({ error: 'Nome do Workspace é obrigatório' })
    .trim()
    .min(1, 'Nome do Workspace não pode ficar vazio')
    .max(50, 'Nome do Workspace deve ter no máximo 50 caracteres'),
  colorPalette: z.enum(WORKSPACE_COLOR_PALETTES).default(DEFAULT_WORKSPACE_COLOR_PALETTE),
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
