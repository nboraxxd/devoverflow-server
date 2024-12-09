import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { HTTP_STATUS_CODE } from '@/constants/http-status-code'

export const registerController = async (req: Request<ParamsDictionary, any, any>, res: Response<any>) => {
  res.status(HTTP_STATUS_CODE.Created).json({ message: 'Please check your email to verify your account' })
}
