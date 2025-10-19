import { Module } from '@nestjs/common';
import { JwtEncrypter } from './jwt-encrypter';
import { BcryptHasher } from './bcrypt-hasher';
import { Encrypter } from '@/domain/user/application/cryptography/encrypter';
import { HashGenerator } from '@/domain/user/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/user/application/cryptography/hash-comparer';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
