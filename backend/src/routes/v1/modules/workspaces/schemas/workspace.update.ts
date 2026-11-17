import { z } from 'zod'
import { WORKSPACE_COLOR_PALETTES } from './workspaces.create.js'

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

// para aceitar campos opcionais no zod mas negar caso nenhum delas venha, usei esse sistema com `optional()` + `refine()`

// n são aceitos valores null e nem undefined nos dois campos ao mesmo tempo, null n é aceito por natureza
// usando .optional()

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>