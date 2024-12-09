import { registerController } from '@/controllers/auth.controllers'
import { Router } from 'express'

const authRouter = Router()

authRouter.post('/register', registerController)

export default authRouter
