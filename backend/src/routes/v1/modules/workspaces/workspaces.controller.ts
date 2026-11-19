import { authedHandler } from '../../../../utils/authedHandler.js'
import { sendSuccess } from '../../../../utils/sendSuccess.js'

import type { WorkspaceParams } from './schemas/workspaces.params.js'
import type { CreateWorkspaceInput } from './schemas/workspaces.create.js'
import type { UpdateWorkspaceInput } from './schemas/workspace.update.js'

import * as service from './workspaces.service.js'

export const createWorkspace = authedHandler<unknown, CreateWorkspaceInput>(
  async (req, res) => {
    const workspace = await service.createWorkspace(req.userId, req.body)

    return sendSuccess(res, {
      statusCode: 201,
      data: { workspace }
    })
  },
)

export const getWorkspaces = authedHandler(
  async (req, res) => {
    const workspaces = await service.getWorkspaces(req.userId)

    return sendSuccess(res, {
      data: { workspaces }
    })
  }
)

export const getWorkspace = authedHandler<WorkspaceParams>(
  async (req, res) => {
    const workspace = await service.getWorkspace(req.params.workspaceId, req.userId)

    return sendSuccess(res, {
      data: { workspace }
    })
  }
)

export const updateWorkspace = authedHandler<WorkspaceParams, UpdateWorkspaceInput>(
  async (req, res) => {

    const workspace = await service.updateWorkspace(
      req.params.workspaceId, 
      req.userId,
      req.body
    )

    return sendSuccess(res, {
      data: { workspace }
    })
  }
)
