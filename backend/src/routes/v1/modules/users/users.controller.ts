import { authedHandler } from '../../../../utils/authedHandler.js'
import { sendSuccess } from '../../../../utils/sendSuccess.js'
import { clearRefreshTokenHashCookie } from '../auth/auth.cookie.js'

import type { NewUsernameInput } from './schemas/users.username.js'
import type { ChangePasswordInput } from './schemas/users.update.password.js'
import type { DeleteUserInput } from './schemas/users.delete.user.js'

import * as service from './users.service.js'
import type { UserSettingsUpdate, UserDetails } from '../../../../types/users.auth.js'

export const me = authedHandler(async (req, res) => {
  const userData = await service.getUserData(req.userId)

  return sendSuccess<{ user: UserDetails }>(res, {
    data: {
      user: userData,
    },
  })
})

export const updateUsername = authedHandler<unknown, NewUsernameInput>(async (req, res) => {
  const registeredNewUsername = await service.registerNewUsername(req.userId, req.body.username)

  return sendSuccess(res, {
    data: {
      username: registeredNewUsername,
    },
  })
})

// eu apenas retorno para o front o theme atualizado para ficar mais facil de eu testar
// o front só dependera de sucesso ou falha, pq ele vai alterar o theme na hora sem depender da resposta da API voltar para dai sim ele atualizar na tela

export const updateSettings = authedHandler<unknown, UserSettingsUpdate>(async (req, res) => {
  const newTheme = await service.changeSettings(req.userId, req.body.theme)

  return sendSuccess(res, {
    data: {
      theme: newTheme,
    },
  })
})

export const updatePassword = authedHandler<unknown, ChangePasswordInput>(async (req, res) => {
  await service.changePassword(req.userId, req.body.currentPassword, req.body.newPassword)

  // sessão encerada, tbm é feito a limpeza no banco
  clearRefreshTokenHashCookie(res)

  return sendSuccess(res, {
    message: 'senha alterada com sucesso e sessão encerrada',
  })
})

export const deleteUser = authedHandler<unknown, DeleteUserInput>(async (req, res) => {
  await service.deleteUser(req.userId, req.body.password)

  clearRefreshTokenHashCookie(res)

  return sendSuccess(res, {
    message: 'Conta excluída com sucesso',
  })
})
