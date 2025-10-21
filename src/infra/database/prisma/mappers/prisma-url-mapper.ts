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
        accessCounter: raw.accessCounter ?? 0, // evita undefined
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt ?? null,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(url: Url): Prisma.ShortUrlUncheckedCreateInput {
    return {
      id: url.id.toString(),
      userId: url.userId?.toString() ?? undefined, // deixa explícito undefined quando null
      slug: url.slug.value,
      alias: url.alias?.value ?? undefined,
      originalUrl: url.originalUrl.value,
      accessCounter: url.accessCounter ?? undefined,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      deletedAt: url.deletedAt ?? undefined,
    };
  }
}
