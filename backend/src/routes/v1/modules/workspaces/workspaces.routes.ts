import { Router } from 'express'

import { validateBody } from '../../../../middlewares/validateBody.js'
import { validateParams } from '../../../../middlewares/validateParams.js'

import { createWorkspaceSchema } from './schemas/workspaces.create.js'
import { workspaceParamsSchema } from './schemas/workspaces.params.js'
import { updateWorkspaceSchema } from './schemas/workspace.update.js'

import * as controller from './workspaces.controller.js'

const router = Router()

router.post('/', validateBody(createWorkspaceSchema), controller.createWorkspace)

router.get('/', controller.getWorkspaces)

router.get(
  '/:workspaceId', 
  validateParams(workspaceParamsSchema), 
  controller.getWorkspace
)

router.patch(
  '/:workspaceId', 
  validateParams(workspaceParamsSchema), 
  validateBody(updateWorkspaceSchema), 
  controller.updateWorkspace
)

export default router
