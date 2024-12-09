import { ObjectId } from 'mongodb'

import { ROLE, Role } from '@/constants/type'

type UserType = {
  _id: ObjectId
  email: string
  name: string
  password: string
  username: string
  emailVerifyToken?: string
}

export default class User {
  _id: ObjectId
  email: string
  name: string
  password: string
  username: string
  role: Role
  status: {
    isVerified: boolean
    isLocked: boolean
  }
  reputation: number
  emailVerifyToken: string | null
  resetPasswordToken: string | null
  avatar: string | null
  bio: string | null
  location: string | null
  website: string | null
  createdAt: Date
  updatedAt: Date

  constructor(user: UserType) {
    const currentDate = new Date()

    this._id = user._id
    this.email = user.email
    this.name = user.name
    this.password = user.password
    this.username = user.username
    this.role = ROLE.User
    this.status = {
      isVerified: false,
      isLocked: false,
    }
    this.reputation = 0
    this.emailVerifyToken = user.emailVerifyToken || null
    this.resetPasswordToken = null
    this.avatar = null
    this.bio = null
    this.location = null
    this.website = null
    this.createdAt = currentDate
    this.updatedAt = currentDate
  }
}

export type UserDocument = Required<User>

export type UserDocumentWithoutPassword = Omit<UserDocument, 'password'>

export type UserDocumentWithoutSensitiveInfo = Omit<
  UserDocument,
  'password' | 'emailVerifyToken' | 'resetPasswordToken'
>
