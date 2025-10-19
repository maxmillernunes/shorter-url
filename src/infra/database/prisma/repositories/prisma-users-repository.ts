import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersRepository } from '@/domain/user/application/repositories/users-repository';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import type { User } from '@/domain/user/enterprise/entities/user';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({ data });
  }
}
