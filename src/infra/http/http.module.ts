import { Module } from '@nestjs/common';
import { RegisterController } from './controllers/users/register-user.controller';
import { RegisterUserUseCase } from '@/domain/user/application/use-cases/register-user';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateController } from './controllers/auth/auth-user.controller';
import { AuthenticateUserUseCase } from '@/domain/user/application/use-cases/authenticate-user';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterController, AuthenticateController],
  providers: [RegisterUserUseCase, AuthenticateUserUseCase],
})
export class HttpModule {}
