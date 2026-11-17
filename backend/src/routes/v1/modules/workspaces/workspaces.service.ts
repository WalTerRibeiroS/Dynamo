import { uuidv7 } from 'uuidv7'

import * as repository from './workspaces.repository.js'

import type { CreateWorkspaceInput, WorkspaceColorPalette } from './schemas/workspaces.create.js'
import type { Workspace, workspacesData, workspaceView, UpdatedWorkspaceData } from './workspaces.repository.js'

import { NotFoundError, ValidationError } from '../../../../utils/errors.js'
import type { UpdateWorkspaceInput } from './schemas/workspace.update.js'
import { getChangedFields } from '../../../../utils/getChangedFields.js'

type UpdateInput = UpdatedWorkspaceData

export const createWorkspace = async (
  userId: string,
  workspaceData: CreateWorkspaceInput,
): Promise<Workspace> => {

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
): Promise<workspacesData> => {

  // tudo bem caso retorne um array vazio
  return repository.getWorkspacesData(userId)
}

export const getWorkspace = async (
  workspaceId: string,
  userId: string
): Promise<workspaceView> => {

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
): Promise<UpdatedWorkspaceData> => {

  const currentWorkspace = await repository.getWorkspaceData(workspaceId, userId)

  if (!currentWorkspace) {
    throw new NotFoundError()
  }

  // antes de me crucificarem por usar 'as' aqui pra desligar o compilador
  // o caso do valor da propriedade ser undefined já é tratado dentro da função
  
  const changes = getChangedFields(currentWorkspace, input as UpdateInput)

  console.log(changes);
  console.log(typeof changes);

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