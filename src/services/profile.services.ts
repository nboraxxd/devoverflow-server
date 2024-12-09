import { ObjectId } from 'mongodb'

import databaseService from '@/services/database.services'
import { UserDocumentWithoutPassword, UserDocumentWithoutSensitiveInfo } from '@/models/user.models'

class ProfileService {
  async findById(userId: string) {
    return databaseService.users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    ) as Promise<UserDocumentWithoutPassword>
  }

  async findByIdWithoutSensitiveInfo(userId: string) {
    return databaseService.users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0, emailVerifyToken: 0, resetPasswordToken: 0 } }
    ) as Promise<UserDocumentWithoutSensitiveInfo>
  }

  async findByEmail(email: string) {
    return databaseService.users.findOne(
      { email },
      { projection: { password: 0 } }
    ) as Promise<UserDocumentWithoutPassword>
  }
}

const profileService = new ProfileService()
export default profileService
