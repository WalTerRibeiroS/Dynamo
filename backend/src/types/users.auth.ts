// como tipos dentro desse arquivo são compartilhados por diferentes
// módulos (auth e users) esse sera o lugar onde ira centralizar os tipos 

export type UserRow = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl: string | null;
  theme: 'light' | 'dark' | 'system';
  refreshTokenHash: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// ENTITY

export type UserTheme = UserRow['theme']

// UPDATE

export type UserSettingsUpdate = Pick<
  UserRow,
  'theme'
>

// INSERTs

export type NewUserRow = Pick<
  UserRow,
  'id' | 'username'
>

export type CreateUserInput = Pick<
  UserRow,
  'id' | 'username' | 'email' | 'passwordHash' | 'refreshTokenHash'
>

// SELECTs

export type UserPasswordDetails = Pick<
  UserRow,
  'id' | 'passwordHash'
>

export type UserDetails = Pick<
  UserRow,
  'id' | 'username' | 'email' | 'theme' | 'createdAt'
>
