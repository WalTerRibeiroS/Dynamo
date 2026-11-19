import { z } from 'zod'
import { WORKSPACE_COLOR_PALETTES } from '../workspaces.constants.js'

export const updateWorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .trim()
    .min(1, 'Nome do Workspace não pode ficar vazio')
    .max(50, 'Nome do Workspace deve ter no máximo 50 caracteres')
    .optional(),
  
  colorPalette: z.enum(WORKSPACE_COLOR_PALETTES).optional(),
}).strict().refine(
  (v) => Object.values(v).some(value => value !== undefined),
  { error: 'Informe ao menos um campo para ser atualizado' }
)

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>