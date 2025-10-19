import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Url } from '@/domain/url/enterprise/entities/url';
import { Alias } from '@/domain/url/enterprise/entities/value-objects/alias';
import { OriginalUrl } from '@/domain/url/enterprise/entities/value-objects/original-url';
import { Slug } from '@/domain/url/enterprise/entities/value-objects/slug';

import type { Prisma, ShortUrl as PrismaUrl } from '@prisma/client';

export class PrismaShortUrlMapper {
  static toDomain(raw: PrismaUrl): Url {
    return Url.create(
      {
        userId: raw.userId ? new UniqueEntityId(raw.userId) : null,
        slug: Slug.create(raw.slug),
        alias: raw.alias ? Alias.create(raw.alias) : null,
        originalUrl: OriginalUrl.create(raw.originalUrl),
        accessCounter: raw.accessCounter,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(url: Url): Prisma.ShortUrlUncheckedCreateInput {
    return {
      id: url.id.toString(),
      userId: url.userId?.toString(),
      slug: url.slug.value,
      alias: url.alias?.value,
      originalUrl: url.originalUrl.value,
      accessCounter: url.accessCounter ? url.accessCounter : undefined,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      deletedAt: url.deletedAt,
    };
  }
}
