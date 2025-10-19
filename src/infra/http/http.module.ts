import { Module } from '@nestjs/common';
import { RegisterController } from './controllers/users/register-user.controller';
import { RegisterUserUseCase } from '@/domain/user/application/use-cases/register-user';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateController } from './controllers/auth/auth-user.controller';
import { AuthenticateUserUseCase } from '@/domain/user/application/use-cases/authenticate-user';
import { CreateShortUrlController } from './controllers/shorten/create-shorten-url.controller';
import { CreateShortUrlUseCase } from '@/domain/url/application/use-cases/create-short-url';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterController,
    AuthenticateController,
    CreateShortUrlController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    CreateShortUrlUseCase,
  ],
})
export class HttpModule {}
