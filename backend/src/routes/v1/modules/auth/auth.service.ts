import bcrypt from 'bcrypt'
import { uuidv7 } from 'uuidv7'

//import baseLogger from "../../../../utils/logger.js"
import { ValidationError } from '../../../../utils/errors.js'
import { UnauthorizedError } from '../../../../utils/errors.js'
import { issueAuthTokens, createHashToken } from './auth.tokens.js'
import { verifyRefreshToken } from './auth.cookie.js'

import type { RegisterUserInput } from './schemas/auth.register.schema.js'
import type { LoginUserInput } from './schemas/auth.login.schema.js'
import type { Issue } from '../../../../types/issue.js'
import type { CreateUserInput } from '../../../../types/user.js'

import * as repository from '../auth/auth.repository.js'

//const logger = baseLogger.child({ layer: "service"})

export const registerUser = async (userData: RegisterUserInput) => {
  const issues: Issue[] = []

  const { username, email, password } = userData

  const [emailInUse, usernameInUse] = await Promise.all([
    repository.emailExists(email),
    repository.usernameExists(username),
  ])

  if (emailInUse) {
    issues.push({
      field: 'email',
      message: 'email já esta em uso',
      code: 'EMAIL_ALREADY_EXISTS',
    })
  }

  if (usernameInUse) {
    issues.push({
      field: 'username',
      message: 'username já esta em uso',
      code: 'USERNAME_ALREADY_EXISTS',
    })
  }

  if (issues.length > 0) {
    throw new ValidationError({ issues })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const id = uuidv7()

  const { accessToken, refreshToken, refreshTokenHash } = issueAuthTokens(id)

  const createUserInput: CreateUserInput = {
    id,
    username,
    email,
    passwordHash,
    refreshTokenHash,
  }

  const newUser = await repository.createUser(createUserInput)

  const user = { ...newUser, accessToken }

  return { user, refreshToken }
}

export const loginUser = async (userData: LoginUserInput) => {
  const { email, password } = userData

  const user = await repository.getUserByEmail(email)

  if (!user) {
    throw new ValidationError({
      issues: [
        {
          message: 'credenciais invalidas',
          code: 'INVALID_CREDENCIALS',
        },
      ],
    })
  }

  const { id, passwordHash } = user

  const validPassword = await bcrypt.compare(password, passwordHash)

  if (!validPassword) {
    throw new ValidationError({
      issues: [
        {
          message: 'credenciais invalidas',
          code: 'INVALID_CREDENCIALS',
        },
      ],
    })
  }

  const { accessToken, refreshToken, refreshTokenHash } = issueAuthTokens(id)

  await repository.saveNewRefreshToken(refreshTokenHash, id)

  return { accessToken, refreshToken }
}

export const refreshSession = async (token: unknown) => {
  if (typeof token !== 'string' || token.length === 0) {
    throw new UnauthorizedError('Refresh token válido ausente')
  }

  const userId = verifyRefreshToken(token)
  const oldHash = createHashToken(token)
  const { accessToken, refreshToken, refreshTokenHash: newHash } = issueAuthTokens(userId)

  // veja `docs/escolha-de-design.md` na sessão do service para entender o pq dessa escolha
  const rotated = await repository.rotateRefreshTokenHash(userId, oldHash, newHash)

  if (!rotated) {
    throw new UnauthorizedError('Sessão inválida')
  }

  return { accessToken, refreshToken }
}

export const logoutUser = async (token: unknown) => {
  // Não lanço erro aqui pq indeferente de ser ou n ser um token válido
  // eu apago ele do navegador
  if (typeof token !== 'string' || token.length === 0) return

  // Apenas lanço erro quando NÃO é UnauthorizedError, ou seja erro de banco
  // ou erro humano, caso seja UnauthorizedError ignoro e efetuo o logout
  try {
    const userId = verifyRefreshToken(token)
    await repository.clearRefreshTokenHash(userId, createHashToken(token))
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) {
      throw error
    }
  }
}
