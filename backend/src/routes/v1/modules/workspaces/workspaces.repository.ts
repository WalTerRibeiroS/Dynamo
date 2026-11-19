import pool from '../../../../config/db.js'

import { buildSetClause } from '../../../../utils/buildSetClause.js'
import { DatabaseConflitError, NotFoundError } from '../../../../utils/errors.js'
import { isDatabaseError } from '../../../../utils/isDatabaseError.js'

import type { UpdateWorkspaceInput } from './schemas/workspace.update.js'
import type { NewWorkspaceRow, WorkspaceDetails, WorkspaceSettingsUpdate, WorkspaceSummary } from './workspaces.types.js'

function workspaceCreateError(error: unknown): never {
  if (isDatabaseError(error)) {

    if (error.code === '23505' &&
      error.constraint === 'workspaces_user_name_unique') {
      throw new DatabaseConflitError({
        issues: [
          {
            message: 'Já existe um Workspace com esse nome.',
            code: 'WORKSPACE_NAME_ALREADY_EXISTS',
            field: 'workspaceName',
          },
        ],
      })
    }

    if (error.code === '23514' &&
      error.constraint === 'workspaces_user_limit') {
      throw new DatabaseConflitError({
        issues: [
          {
            message: 'O usuário pode possuir no máximo 5 Workspaces.',
            code: 'WORKSPACE_LIMIT_REACHED',
          },
        ],
      })
    }

    if (error.code === '23503' &&
      error.constraint === 'workspaces_user_id_fkey') {
      throw new NotFoundError('Usuário não encontrado')
    }
  }

  throw error
}

export const createWorkspace = async ({
  workspaceId,
  userId,
  workspaceName,
  colorPalette,
}: WorkspaceSummary): Promise<NewWorkspaceRow | undefined> => {
  try {
    const { rows } = await pool.query<NewWorkspaceRow>(
      `
      INSERT INTO workspaces (
        workspace_id,
        user_id,
        workspace_name,
        color_palette
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        workspace_id AS "workspaceId",
        user_id AS "userId",
        workspace_name AS "workspaceName",
        zoom,
        camera_x AS "cameraX",
        camera_y AS "cameraY",
        color_palette AS "colorPalette",
        is_edit_mode AS "isEditMode"
      `,
      [workspaceId, userId, workspaceName, colorPalette],
    )

    return rows[0]
  } catch (error) {
    workspaceCreateError(error)
  }
}

// pool.query<WorkspaceData> recebe o tipo de cada linha, não o tipo do array inteiro. O pg já tipa rows como WorkspaceData[].

export const getWorkspacesData = async (
  userId: string
): Promise<WorkspaceSummary[]> => {
  const { rows } = await pool.query<WorkspaceSummary>(
    `
    SELECT
      workspace_id AS "workspaceId",
      user_id AS "userId",
      workspace_name AS "workspaceName",
      color_palette AS "colorPalette"
    FROM workspaces
    WHERE user_id = $1
    ORDER BY created_at ASC;
    `,
    [userId]
  )

  return rows
}

// futuramente adicionar domains aqui e tbm lembrar de atualizar user/me

export const getWorkspaceData = async (
  workspaceId: string,
  userId: string
): Promise<WorkspaceDetails | undefined> => {
  const { rows } = await pool.query<WorkspaceDetails>(
    `
    SELECT
      workspace_name AS "workspaceName",
      color_palette AS "colorPalette",
      zoom,
      camera_x AS "cameraX",
      camera_y AS "cameraY",
      is_edit_mode AS "isEditMode"
    FROM workspaces
    WHERE 
      user_id = $1 
    AND 
      workspace_id = $2 
    `,
    [userId, workspaceId]
  )

  return rows[0]
}

const workspaceColumns = {
  workspaceName: 'workspace_name',
  colorPalette: 'color_palette'
} satisfies Record<keyof UpdateWorkspaceInput, string>

export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  changes: UpdateWorkspaceInput
): Promise<WorkspaceSettingsUpdate | undefined> => {

  const { assignments, values } = buildSetClause(changes, workspaceColumns, 3)

  try {
    const { rows } = await pool.query<WorkspaceSettingsUpdate>(
      `
      UPDATE workspaces
      SET
        ${[...assignments, 
          'updated_at = CURRENT_TIMESTAMP'].join(', ')}
      WHERE 
        user_id = $1
      AND
        workspace_id = $2
      RETURNING
        color_palette AS "colorPalette",
        workspace_name AS "workspaceName"
      `,
      [userId, workspaceId, ...values]
    )

    return rows[0]
  } catch (error) {
    workspaceCreateError(error)
  }
}