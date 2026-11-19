import type { WorkspaceColorPalette } from "./workspaces.types.js";

export const WORKSPACE_COLOR_PALETTES = [
  'red',
  'green',
  'blue',
  'purple',
  'yellow',
  'white',
  'black',
] as const

export const DEFAULT_WORKSPACE_COLOR_PALETTE: WorkspaceColorPalette = 'purple';

// uma boa ideia mas n sei se eu vou lembrar de usar
// e sera que faz sentido sendo que eu tbm teria que
// mudar no banco de dados n?

export const MAX_WORKSPACES_PER_USER = 5;
export const WORKSPACE_NAME_MAX_LENGTH = 50;
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 3;