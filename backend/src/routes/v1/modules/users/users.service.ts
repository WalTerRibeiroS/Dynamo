import baseLogger from "../../../../utils/logger.js"

import type { Issue } from '../../../../types/issue.js'

import * as repository from './users.repository.js'
import { NotFoundError } from "../../../../utils/errors.js"

const logger = baseLogger.child({ layer: "serive"})

export const getUserData = async(userId: string) => {
  logger.info("entrei")

  const userData = await repository.getUserDataById(userId)

  if (!userData) throw new NotFoundError()

  logger.info("sai")
  return userData
}

export const registerNewUsername = async(userId: string, newUsername: string) => {
  logger.info("entrei")

  const newValidUsername = await repository.updateUsername(userId, newUsername)

  if (!newValidUsername) throw new NotFoundError()

  logger.info("sai")
  return newValidUsername
}