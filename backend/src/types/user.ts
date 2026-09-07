export type CreatedUser = {
  id: string;
  username: string;
};

export type CreateUserInput = {
  id: string, 
  username: string, 
  email: string,
  passwordHash: string,
  refreshTokenHash: string
}