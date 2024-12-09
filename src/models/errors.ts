import multer from 'multer'
import { ZodIssueCode } from 'zod'

import { ValidationLocation } from '@/middlewares/validators.middleware'
import { HTTP_STATUS_CODE, HttpStatusCode } from '@/constants/http-status-code'

type ErrorsType = {
  code: ZodIssueCode | multer.ErrorCode
  message: string
  path: string
  location: ValidationLocation
}[]

export class ErrorWithStatus extends Error {
  statusCode: HttpStatusCode
  errorInfo?: Record<string, any>

  constructor({
    message,
    statusCode,
    errorInfo,
  }: {
    message: string
    statusCode: HttpStatusCode
    errorInfo?: Record<string, any>
  }) {
    super(message)
    this.statusCode = statusCode
    this.errorInfo = errorInfo
  }
}

export class ErrorWithStatusAndLocation extends ErrorWithStatus {
  location: ValidationLocation
  errorInfo?: Record<string, any>

  constructor({
    message,
    statusCode,
    location,
    errorInfo,
  }: {
    message: string
    statusCode: HttpStatusCode
    location: ValidationLocation
    errorInfo?: Record<string, any>
  }) {
    super({ message, statusCode })
    this.location = location
    this.errorInfo = errorInfo
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType

  constructor({ message = 'Validation error', errors }: { message?: string; errors: ErrorsType }) {
    super({ message, statusCode: HTTP_STATUS_CODE.UnprocessableEntity })
    this.errors = errors
  }
}
