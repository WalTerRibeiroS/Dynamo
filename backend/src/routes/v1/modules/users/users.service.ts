import baseLogger from '../../../../utils/logger.js'

import { AppError, NotFoundError, ValidationError } from '../../../../utils/errors.js'

import bcrypt from 'bcrypt'

import * as repository from './users.repository.js'
import type { UserData } from '../../../../types/user.js'
import type { UserTheme } from '../../../../types/user.js'

const logger = baseLogger.child({ layer: 'service' })

export const getUserData = async (userId: string): Promise<UserData> => {

  const userData = await repository.getUserDataById(userId)

  if (!userData) throw new NotFoundError()

  return userData
}

export const registerNewUsername = async (userId: string, newUsername: string): Promise<string> => {

  const currentUserData = await repository.getUserDataById(userId)

  if (!currentUserData) throw new NotFoundError()

  // feito dessa forma para evitar caso de no-op update na tabela
  // n existe problema de performance de querys pq o getUserDataById
  // faz uma query com chave primaria da tabela o que n gera impacto de performance

  if (currentUserData.username === newUsername) {
    return currentUserData.username
  }

  const newValidUsername = await repository.updateUsername(userId, newUsername)

  if (!newValidUsername) throw new NotFoundError()

  return newValidUsername
}

export const changeSettings = async (userId: string, newTheme: UserTheme): Promise<UserTheme> => {

  const currentUserData = await repository.getUserDataById(userId)

  if (!currentUserData) throw new NotFoundError()

  // mesmo caso da registerNewUsername

  if (currentUserData.theme === newTheme) {
    return currentUserData.theme
  }

  const newValidTheme = await repository.updateSettings(userId, newTheme)

  if (!newValidTheme) throw new NotFoundError()

  return newValidTheme
}

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {

  const currentPasswordHash = await repository.getPasswordHashById(userId)

  if (!currentPasswordHash) {
    throw new NotFoundError('usuário não foi encontrado')
  }

  const validCurrentPassword = await bcrypt.compare(currentPassword, currentPasswordHash)

  if (!validCurrentPassword) {
    throw new ValidationError({
      issues: [
        {
          field: 'currentPassword',
          message: 'senha incorreta',
          code: 'INVALID_VALUE',
        },
      ],
    })
  }

  if (currentPassword === newPassword) {
    throw new ValidationError({
      issues: [
        {
          field: 'newPassword',
          message: 'a senha nova não pode ser igual a senha antiga',
          code: 'PASSWORD_DUPLICATION',
        },
      ],
    })
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10)

  const updatedPassword = await repository.updatePassword(
    userId,
    currentPasswordHash,
    newPasswordHash,
  )

  if (!updatedPassword) {
    throw new AppError({
      statusCode: 409,
      code: 'CONCURRENT_PASSWORD_UPDATE',
      message: 'Não foi possível atualizar a senha. Tente novamente.',
    })
  }

}

export const deleteUser = async (userId: string, password: string): Promise<void> => {

  const passwordHash = await repository.getPasswordHashById(userId)

  if (!passwordHash) {
    throw new NotFoundError('usuário não foi encontrado')
  }

  const validPassword = await bcrypt.compare(password, passwordHash)

  if (!validPassword) {
    throw new ValidationError({
      issues: [
        {
          field: 'password',
          message: 'senha incorreta, a exclusão da conta não foi efetuada',
          code: 'INVALID_VALUE',
        },
      ],
    })
  }

  const deletedUserAccount = await repository.deleteAccount(userId, passwordHash)

  if (!deletedUserAccount) {
    throw new AppError({
      statusCode: 409,
      code: 'CONCURRENT_ACCOUNT_DELETION',
      message: 'Não foi possível apagar a conta. Tente novamente.',
    })
  }
}