import bcrypt from "bcrypt"
import { uuidv7 } from "uuidv7"

import baseLogger from "../../../../utils/logger.js"
import type { RegisterUserInput } from "./schemas/auth.register.schema.js"
import type { Issue } from "../../../../types/issue.js"
import { ValidationError } from "../../../../utils/errors.js"
import { issueAuthTokens } from "./auth.tokens.js"
import type { CreateUserInput } from "../../../../types/user.js"

import * as repository from "../auth/auth.repository.js"

const logger = baseLogger.child({ layer: "service"})

export const registerUser = async(userData: RegisterUserInput) => {

  logger.info("entrou")

  const issues: Issue[] = []

  const { username , email, password} = userData

  /* const [emailInUse, usernameInUse] = await Promise.all([
    repository.emailExists(email),
    repository.usernameExists(username),
  ]);

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
      message: "username já esta em uso",
      code: "USERNAME_ALREADY_EXISTS"
    })
  }

  if (issues.length > 0) {
    throw new ValidationError({ issues })
  } */

  const passwordHash = await bcrypt.hash(password, 10)
  const id = uuidv7()

  const { accessToken, refreshToken, refreshTokenHash } = issueAuthTokens(id);

  const createUserInput: CreateUserInput = { 
    id, 
    username, 
    email, 
    passwordHash, 
    refreshTokenHash 
  }

  const newUser = await repository.createUser(createUserInput)

  const user = { ...newUser, accessToken}
  logger.info("saiu", )

  return { user, refreshToken }
}