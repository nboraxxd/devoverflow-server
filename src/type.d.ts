import { ObjectId } from 'mongodb'
import { TokenPayload } from '@/types/token.type'
import { UserDocument, UserDocumentWithoutPassword } from '@/models/user.model'

declare module 'express' {
  interface Request {
    user?: UserDocument | UserDocumentWithoutPassword | { _id: ObjectId }
    authorizationPayload?: TokenPayload
    refreshTokenPayload?: TokenPayload
    emailVerifyTokenPayload?: TokenPayload
    resetPasswordTokenPayload?: TokenPayload
  }
}
