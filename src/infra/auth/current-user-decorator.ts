import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { UserPayload } from './jwt.strategy'
import type { Request } from 'express'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>()

    return request.user as UserPayload
  },
)
