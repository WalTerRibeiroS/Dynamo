export type updateSettingsInput = {
  theme: 'light' | 'dark' | 'system'
}

export type UserTheme = 'light' | 'dark' | 'system'

export type UserData = {
  id: string
  username: string
  email: string
  theme: UserTheme
  createdAt: Date
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
