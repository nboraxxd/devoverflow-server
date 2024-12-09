export const TOKEN_TYPE = {
  AccessToken: 'AccessToken',
  RefreshToken: 'RefreshToken',
  EmailVerifyToken: 'EmailVerifyToken',
  ResetPasswordToken: 'ResetPasswordToken',
} as const

export type TokenType = keyof typeof TOKEN_TYPE

export const ROLE = {
  Admin: 'Admin',
  Moderator: 'Moderator',
  User: 'User',
} as const

export type Role = keyof typeof ROLE
