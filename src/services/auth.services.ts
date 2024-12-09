import z from 'zod'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types'
import User from '@/models/user.models'
import { EntityError, ErrorWithStatus } from '@/models/errors'
import RefreshToken from '@/models/refresh-token.model'
import { sendEmail } from '@/utils/mailgun'
import { hashPassword } from '@/utils/crypto'
import { decodeToken, signToken } from '@/utils/jwt'
import { ROLE, Role, TOKEN_TYPE } from '@/constants/type'
import { EMAIL_TEMPLATES } from '@/constants/email-templates'
import { HTTP_STATUS_CODE } from '@/constants/http-status-code'
import { RegisterBodyType } from '@/schemas/auth.schema'
import envVariables from '@/schemas/env-variables.schema'
import databaseService from '@/services/database.services'
import profileService from '@/services/profile.services'

class AuthService {
  async signAccessToken({ role, userId }: { role: Role; userId: string }) {
    return signToken({
      payload: { userId, role, tokenType: TOKEN_TYPE.AccessToken },
      privateKey: envVariables.JWT_SECRET_ACCESS_TOKEN,
      options: {
        expiresIn: envVariables.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    })
  }

  async signRefreshToken({ role, userId, exp }: { role: Role; userId: string; exp?: number }) {
    return signToken({
      payload: omitBy(
        {
          userId,
          role,
          tokenType: TOKEN_TYPE.RefreshToken,
          exp,
        },
        isUndefined
      ) as Pick<TokenPayload, 'userId' | 'role' | 'tokenType'> & { exp?: number },
      privateKey: envVariables.JWT_SECRET_REFRESH_TOKEN,
      options: exp ? undefined : { expiresIn: envVariables.JWT_REFRESH_TOKEN_EXPIRES_IN },
    })
  }

  private async signAccessTokenAndRefreshToken({ role, userId }: { role: Role; userId: string }) {
    return Promise.all([this.signAccessToken({ role, userId }), this.signRefreshToken({ role, userId })])
  }

  async signEmailVerifyToken({ role, userId }: { role: Role; userId: string }) {
    return signToken({
      payload: { userId, role, tokenType: TOKEN_TYPE.AccessToken },
      privateKey: envVariables.JWT_SECRET_EMAIL_VERIFY_TOKEN,
      options: {
        expiresIn: envVariables.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN,
      },
    })
  }

  async sendEmailVerifyUser(payload: { email: string; name: string; token: string }) {
    const { email, name, token } = payload

    return sendEmail({
      name,
      email,
      subject: '[DevOverflow] Verify your email',
      html: EMAIL_TEMPLATES.EMAIL_VERIFICATION({
        name,
        link: `${envVariables.CLIENT_URL}/verify-email?token=${token}`,
      }),
    })
  }

  async validateUserRegister(req: Request<ParamsDictionary, any, RegisterBodyType>) {
    const user = await profileService.findByEmail(req.body.email)

    if (user) {
      throw new EntityError({
        message: 'Validation error occurred in body',
        errors: [
          {
            code: z.ZodIssueCode.custom,
            message: 'Email already exists',
            location: 'body',
            path: 'email',
          },
        ],
      })
    }
  }

  async register(payload: Omit<RegisterBodyType, 'confirmPassword'>) {
    const { email, name, password } = payload

    const userId = new ObjectId()

    const [emailVerifyToken, accessToken, refreshToken] = await Promise.all([
      this.signEmailVerifyToken({ role: ROLE.User, userId: userId.toHexString() }),
      this.signAccessToken({ role: ROLE.User, userId: userId.toHexString() }),
      this.signRefreshToken({ role: ROLE.User, userId: userId.toHexString() }),
    ])

    const { iat, exp } = decodeToken(refreshToken)

    await Promise.all([
      databaseService.users.insertOne(
        new User({
          _id: userId,
          email,
          name,
          password: hashPassword(password),
          username: userId.toHexString(),
          emailVerifyToken,
        })
      ),
      databaseService.refreshTokens.insertOne(new RefreshToken({ userId, token: refreshToken, iat, exp })),
    ])

    return { accessToken, emailVerifyToken, refreshToken }
  }

  async ensureUserExists(req: Request) {
    const { userId } = req.authorizationPayload as TokenPayload

    const user = await profileService.findByIdWithoutSensitiveInfo(userId)

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        statusCode: HTTP_STATUS_CODE.NotFound,
      })
    }

    req.user = user
  }

  async ensureUserExistsAndVerify(req: Request) {
    const { userId } = req.authorizationPayload as TokenPayload

    const user = await profileService.findByIdWithoutSensitiveInfo(userId)

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        statusCode: HTTP_STATUS_CODE.NotFound,
      })
    }

    if (user.status.isVerified === false) {
      throw new ErrorWithStatus({
        message: 'Email has not been verified',
        statusCode: HTTP_STATUS_CODE.Forbidden,
      })
    }

    req.user = user
  }
}

const authService = new AuthService()
export default authService
