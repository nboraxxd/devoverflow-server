import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { decodeToken } from '@/utils/jwt'
import { HTTP_STATUS_CODE } from '@/constants/http-status-code'
import authService from '@/services/auth.services'
import { RegisterBodyType } from '@/schemas/auth.schema'
import { MessageResponseType } from '@/schemas/common.schema'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterBodyType>,
  res: Response<MessageResponseType>
) => {
  const { email, name, password } = req.body

  const { accessToken, emailVerifyToken, refreshToken } = await authService.register({ email, name, password })

  const { exp: accessTokenExpiresIn } = decodeToken(accessToken)
  const { exp: refreshTokenExpiresIn } = decodeToken(refreshToken)

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(accessTokenExpiresIn * 1000),
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(refreshTokenExpiresIn * 1000),
  })

  res.status(HTTP_STATUS_CODE.Created).json({ message: 'Please check your email to verify your account.' })

  setImmediate(async () => {
    await authService.sendEmailVerifyUser({
      email,
      name,
      token: emailVerifyToken,
    })
  })
}
