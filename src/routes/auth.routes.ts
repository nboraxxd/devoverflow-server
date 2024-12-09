import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { registerController } from '@/controllers/auth.controllers'
import { zodValidator } from '@/middlewares/validators.middleware'
import { registerBodySchema } from '@/schemas/auth.schema'
import authService from '@/services/auth.services'

const authRouter = Router()

authRouter.post(
  '/register',
  zodValidator(registerBodySchema, { location: 'body', customHandler: authService.validateUserRegister }),
  wrapRequestHandler(registerController)
)

export default authRouter
