import crypto from "crypto"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { uuidv7 } from "uuidv7"

import { ENV } from "../../../../config/env.js"
import baseLogger from "../../../../utils/logger.js"
import type { RegisterUserInput } from "../auth/schemas/register.user.schema.js"
import type { Issue } from "../../../../types/issue.js"
import { ValidationError } from "../../../../utils/errors.js"

import * as repository from "../auth/auth.repository.js"

const logger = baseLogger.child({ layer: "service"})

export const registerUser = async(userData: RegisterUserInput) => {

  logger.info("entrou")

  const issues: Issue[] = []

  const { username , email, password} = userData

  const emailInUse = await repository.getUserByEmail(email)
  const usernameInUse = await repository.getUserByUsername(username)

  if (emailInUse) {
    issues.push({
      field: "email",
      message: "email já esta em uso",
      code: "EMAIL_ALREADY_EXISTS"
    })
  }
  
  if (usernameInUse) {
    issues.push({
      field: "username",
      message: "username já esta em uso"
    })
  }

  if (issues.length > 0) {
    throw new ValidationError({ issues })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const id = uuidv7()

  const accessToken = jwt.sign(
    { id },
    ENV.ACCESS_TOKEN,
    { expiresIn: "15m"}
  )

  const refreshToken = jwt.sign(
    { id },
    ENV.REFRESH_TOKEN,
    { expiresIn: "7d"}
  )

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex")

  const newUser = await repository.createUser(id, username, email, passwordHash, refreshTokenHash)

  const user = { ...newUser, accessToken}
  logger.info("saiu", )

  return { user, refreshToken }
}