import { Request } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types'
import envVariables from '@/schemas/env-variables.schema'
import { EmailVerifyTokenType, RefreshTokenType } from '@/schemas/auth.schema'

type SignTokenType = {
  payload: Pick<TokenPayload, 'userId' | 'role' | 'tokenType'> & { exp?: number }
  privateKey: string
  options?: SignOptions
}

type VerifyTokenType = {
  token: string
  jwtKey: string
}

export function signToken({ payload, privateKey, options = { algorithm: 'HS256' } }: SignTokenType) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      }

      resolve(token as string)
    })
  })
}

export function verifyToken({ token, jwtKey }: VerifyTokenType) {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        throw reject(err)
      }

      resolve(decoded as TokenPayload)
    })
  })
}

export function decodeToken(token: string) {
  return jwt.decode(token) as TokenPayload
}

export async function verifyResetPasswordToken(token: string) {
  return verifyToken({
    token: token,
    jwtKey: envVariables.JWT_SECRET_RESET_PASSWORD_TOKEN,
  })
}

export async function setVerifiedEmailVerifyTokenToReq(req: Request<ParamsDictionary, any, EmailVerifyTokenType>) {
  const emailVerifyTokenPayload = await verifyToken({
    token: req.body.emailVerifyToken,
    jwtKey: envVariables.JWT_SECRET_EMAIL_VERIFY_TOKEN,
  })

  req.emailVerifyTokenPayload = emailVerifyTokenPayload
}

export async function setVerifiedAuthorizationTokenToReq(token: string, req: Request) {
  const authorizationPayload = await verifyToken({
    token,
    jwtKey: envVariables.JWT_SECRET_ACCESS_TOKEN,
  })

  req.authorizationPayload = authorizationPayload
}

export async function setVerifiedRefreshTokenToReq(req: Request<ParamsDictionary, any, RefreshTokenType>) {
  const refreshTokenPayload = await verifyToken({
    token: req.body.refreshToken,
    jwtKey: envVariables.JWT_SECRET_REFRESH_TOKEN,
  })

  req.refreshTokenPayload = refreshTokenPayload
}
