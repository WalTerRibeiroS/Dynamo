//import baseLogger from '../../../../utils/logger.js'
import { asyncHandler } from '../../../../utils/asyncHandler.js'
import { sendSuccess } from '../../../../utils/sendSuccess.js'
import { UnauthorizedError } from '../../../../utils/errors.js'

import type { Request, Response } from 'express'

import * as service from './users.service.js'
import type { NewUsername } from './schemas/users.username.schema.js'
import type { ChangePasswordInput } from './schemas/users.update.password.schema.js'
import { clearRefreshTokenHashCookie } from '../auth/auth.cookie.js'
import type { DeleteUserInput } from './schemas/users.delete.user.schema.js'
import type { updateSettingsInput, UserData } from '../../../../types/user.js'

//const logger = baseLogger.child({ layer: 'controller' })

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new UnauthorizedError()

  const userData = await service.getUserData(req.userId)

  return sendSuccess<{ user: UserData }>(res, {
    data: {
      user: userData
    }
  })
})

export const updateUsername = asyncHandler(
  async (req: Request<unknown, unknown, NewUsername>, res: Response) => {
    if (!req.userId) throw new UnauthorizedError()

    const registeredNewUsername = await service.registerNewUsername(req.userId, req.body.username)

    return sendSuccess(res, {
      data: {
        username: registeredNewUsername
      }
    })
  },
)

// eu apenas retorno para o front o theme atualizado para ficar mais facil de eu testar
// o front só dependera de sucesso ou falha, pq ele vai alterar o theme na hora sem depender da resposta da API voltar para dai sim ele atualizar na tela

export const updateSettings = asyncHandler(
  async (req: Request<unknown, unknown, updateSettingsInput>, res: Response) => {
    if (!req.userId) throw new UnauthorizedError()

    const newTheme = await service.changeSettings(req.userId, req.body.theme)

    return sendSuccess(res, {
      data: {
        theme: newTheme
      }
    })
  },
)

export const updatePassword = asyncHandler(
  async (req: Request<unknown, unknown, ChangePasswordInput>, res: Response) => {
    if (!req.userId) throw new UnauthorizedError()

    await service.changePassword(req.userId, req.body.currentPassword, req.body.newPassword)

    // sessão encerada, tbm é feito a limpeza no banco
    clearRefreshTokenHashCookie(res)

    return sendSuccess(res, {
      message: 'senha alterada com sucesso e sessão encerrada',
    })
  },
)

export const deleteUser = asyncHandler(
  async (req: Request<unknown, unknown, DeleteUserInput>, res: Response) => {
    if (!req.userId) throw new UnauthorizedError()

    await service.deleteUser(req.userId, req.body.password)

    clearRefreshTokenHashCookie(res)

    return sendSuccess(res, {
      message: 'Conta excluída com sucesso',
    })
  },
)
