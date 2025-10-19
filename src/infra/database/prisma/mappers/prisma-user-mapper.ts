import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/user/enterprise/entities/user';

import type { Prisma, User as PrismaUser } from '@prisma/client';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      email: user.email,
      password: user.password,
    };
  }
}
