import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { JWTStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth-guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY');
        const publicKey = env.get('JWT_PUBLIC_KEY');

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64').toString('utf8'),
          publicKey: Buffer.from(publicKey, 'base64').toString('utf8'),
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JWTStrategy,
    EnvService,
  ],
})
export class AuthModule {}
