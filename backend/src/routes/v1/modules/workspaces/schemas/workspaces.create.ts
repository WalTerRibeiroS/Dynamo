import { z } from 'zod'

export const WORKSPACE_COLOR_PALETTES = [
  'red',
  'green',
  'blue',
  'purple',
  'yellow',
  'white',
  'black',
] as const

export const createWorkspaceSchema = z.object({
  name: z
    .string({ error: 'Nome do Workspace é obrigatório' })
    .trim()
    .min(1, 'Nome do Workspace não pode ficar vazio')
    .max(50, 'Nome do Workspace deve ter no máximo 50 caracteres'),
  colorPalette: z.enum(WORKSPACE_COLOR_PALETTES).default('purple'),
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
export type WorkspaceColorPalette = (typeof WORKSPACE_COLOR_PALETTES)[number]
