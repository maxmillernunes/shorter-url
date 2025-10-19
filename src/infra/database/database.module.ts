import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { UsersRepository } from '@/domain/user/application/repositories/users-repository';
import { PrismaUrlsRepository } from './prisma/repositories/prisma-urls-repository';
import { UrlsRepository } from '@/domain/url/application/repositories/urls-repository';

@Module({
  providers: [
    PrismaService,

    //Repositories
    {
      useClass: PrismaUsersRepository,
      provide: UsersRepository,
    },
    {
      useClass: PrismaUrlsRepository,
      provide: UrlsRepository,
    },
  ],
  exports: [
    PrismaService,

    // Repositories
    UsersRepository,
    UrlsRepository,
  ],
})
export class DatabaseModule {}
