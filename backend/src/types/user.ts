export type UserData = {
  id: string
  username: string
  email: string
  theme: 'light' | 'dark' | 'system'
  createdAt: string
}

export type CreateUserInput = {
  id: string
  username: string
  email: string
  passwordHash: string
  refreshTokenHash: string
}

export type UserPasswordId = Pick<CreateUserInput, 'id' | 'passwordHash'>
export type CreatedUser = Pick<CreateUserInput, 'id' | 'username'>