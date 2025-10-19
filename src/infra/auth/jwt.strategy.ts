import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { EnvService } from '../env/env.service'
import z from 'zod'

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const publicKey = env.get('JWT_PUBLIC_KEY')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
