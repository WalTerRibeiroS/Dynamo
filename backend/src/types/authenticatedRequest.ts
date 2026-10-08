export type AuthenticatedRequest = Request & {
  userId: string
}