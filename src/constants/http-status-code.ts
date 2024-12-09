export const HTTP_STATUS_CODE = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  PayloadTooLarge: 413,
  UnsupportedMediaType: 415,
  UnprocessableEntity: 422,
  TooManyRequests: 429,
  InternalServerError: 500,
} as const

export type HttpStatusCode = (typeof HTTP_STATUS_CODE)[keyof typeof HTTP_STATUS_CODE]
