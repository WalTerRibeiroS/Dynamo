// arquivo para centralizar os tipos usados pelo módulo workspaces

import { WORKSPACE_COLOR_PALETTES } from "./workspaces.constants.js"

export type WorkspaceRow = {
  workspaceId: string
  userId: string
  workspaceName: string
  zoom: number
  cameraX: number
  cameraY: number
  colorPalette: (typeof WORKSPACE_COLOR_PALETTES)[number]
  isEditMode: boolean
  createdAt: Date,
  updatedAt: Date
}

// ENTITY

export type WorkspaceColorPalette = WorkspaceRow['colorPalette']

// INSERT

export type NewWorkspaceRow = Pick<
  WorkspaceRow, 
  'workspaceId' | 'userId' | 'workspaceName' | 'zoom' | 'cameraX' | 'cameraY' | 'colorPalette' | 'isEditMode'
>

// SELECTs

export type WorkspaceSummary = Pick<
  WorkspaceRow, 
  'workspaceId' | 'userId' | 'workspaceName' | 'colorPalette'
>

export type WorkspaceDetails = Pick<
  WorkspaceRow,
  'workspaceName' | 'colorPalette' | 'zoom' | 'cameraX' | 'cameraY' | 'isEditMode'
>

// UPDATEs

export type WorkspaceSettingsUpdate = Pick<
  WorkspaceRow, 
  'colorPalette' | 'workspaceName'
>

export type WorkspaceViewportUpdate = Pick<
  WorkspaceRow,
  'cameraX' | 'cameraY' | 'zoom'
>

export type WorkspaceModeUpdate = Pick<
  WorkspaceRow,
  'isEditMode'
>

// DELETE
