import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { UsersRepository } from '@/domain/user/application/repositories/users-repository';

@Module({
  providers: [
    PrismaService,

    //Repositories
    {
      useClass: PrismaUsersRepository,
      provide: UsersRepository,
    },
  ],
  exports: [
    PrismaService,

    // Repositories
    UsersRepository,
  ],
})
export class DatabaseModule {}
