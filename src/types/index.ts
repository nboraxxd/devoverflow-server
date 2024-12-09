import { JwtPayload } from 'jsonwebtoken'

import { Role, TokenType } from '@/constants/type'

export interface TokenPayload extends JwtPayload {
  userId: string
  role: Role
  tokenType: TokenType
  iat: number
  exp: number
}

export type SendEmailParams = {
  name: string
  email: string
  subject: string
  html: string
}
