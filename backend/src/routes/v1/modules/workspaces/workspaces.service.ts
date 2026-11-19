import { uuidv7 } from 'uuidv7'

import * as repository from './workspaces.repository.js'

import { NotFoundError } from '../../../../utils/errors.js'
import { getChangedFields } from '../../../../utils/getChangedFields.js'

import type { UpdateWorkspaceInput } from './schemas/workspace.update.js'
import type { NewWorkspaceRow, WorkspaceDetails, WorkspaceSettingsUpdate, WorkspaceSummary } from './workspaces.types.js'
import type { CreateWorkspaceInput } from './schemas/workspaces.create.js'

export const createWorkspace = async (
  userId: string,
  workspaceData: CreateWorkspaceInput,
): Promise<NewWorkspaceRow> => {

  const createdWorkspaceData = await repository.createWorkspace({
    workspaceId: uuidv7(),
    userId,
    ...workspaceData,
  })

  if (!createdWorkspaceData) {
    throw new NotFoundError('Não foi retornado os dados esperados')
  }

  return createdWorkspaceData
}

export const getWorkspaces =  async (
  userId: string
): Promise<WorkspaceSummary[]> => {

  // tudo bem caso retorne um array vazio
  return repository.getWorkspacesData(userId)
}

export const getWorkspace = async (
  workspaceId: string,
  userId: string
): Promise<WorkspaceDetails> => {

  const workspace = await repository.getWorkspaceData(workspaceId, userId)

  if (!workspace) {
    throw new NotFoundError('Não foi possivel encontrar dados compátiveis com esse workspace no momento.')
  }
  
  return workspace
}

export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  input: UpdateWorkspaceInput
): Promise<WorkspaceSettingsUpdate> => {

  const currentWorkspace = await repository.getWorkspaceData(workspaceId, userId)

  if (!currentWorkspace) {
    throw new NotFoundError()
  }

  const changes = getChangedFields(currentWorkspace, input)

  if (Object.keys(changes).length === 0) {
    return {
      colorPalette: currentWorkspace.colorPalette,
      workspaceName: currentWorkspace.workspaceName
    }
  } 

  const workspace = await repository.updateWorkspace(
    workspaceId,
    userId,
    changes
  )

  if (!workspace) {
    throw new NotFoundError('Não foi retornado os dados esperados')
  }

  return workspace
}
