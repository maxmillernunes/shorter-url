import { Module } from '@nestjs/common';
import { RegisterController } from './controllers/users/register-user.controller';
import { RegisterUserUseCase } from '@/domain/user/application/use-cases/register-user';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterController],
  providers: [RegisterUserUseCase],
})
export class HttpModule {}
