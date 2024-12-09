import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

import { initFolder } from '@/utils/files'
import authRouter from '@/routes/auth.routes'
import databaseService from '@/services/database.services'
import envVariables, { API_URL } from '@/schemas/env-variables.schema'
import { defaultErrorHandler } from '@/middlewares/default-error.middleware'

const app = express()
const port = envVariables.PORT

// kết nối với database
databaseService.connect()

// tạo folder uploads
initFolder()

// Quy định CORS
app.use(cors({ credentials: true, origin: envVariables.DOMAIN_ALLOW_LIST.split(', '), optionsSuccessStatus: 200 }))

// parse cookie của client gởi lên, chuyển thành dạnh object để xử lý
app.use(cookieParser())

// parse json của client gởi lên, chuyển thành dạnh object để xử lý
app.use(express.json())

app.use('/auth', authRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`🚀 Server is running at ${API_URL}`)
})
