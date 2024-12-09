import cors from 'cors'
import express from 'express'

import { initFolder } from '@/utils/files'
import envVariables, { API_URL } from '@/schemas/env-variables.schema'
import authRouter from '@/routes/auth.routes'
import databaseService from '@/services/database.services'

const app = express()
const port = envVariables.PORT

// kết nối với database
databaseService.connect()

// Quy định CORS
app.use(cors({ origin: envVariables.CLIENT_URL, optionsSuccessStatus: 200 }))

// tạo folder uploads
initFolder()

// parse json của client gởi lên, chuyển thành dạnh object để xử lý
app.use(express.json())

app.use('/auth', authRouter)

app.listen(port, () => {
  console.log(`🚀 Server is running at ${API_URL}`)
})
