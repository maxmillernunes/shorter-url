import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Url, type UrlProps } from '@/domain/url/enterprise/entities/url';
import { Slug } from '@/domain/url/enterprise/entities/value-objects/slug';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaShortUrlMapper } from '@/infra/database/prisma/mappers/prisma-url-mapper';
import { OriginalUrl } from '@/domain/url/enterprise/entities/value-objects/original-url';

export function makeUrl(override: Partial<UrlProps> = {}, id?: UniqueEntityId) {
  const url = Url.create(
    {
      originalUrl: OriginalUrl.create(faker.internet.url()),
      slug: Slug.createRadom(),
      ...override,
    },
    id,
  );

  return url;
}

@Injectable()
export class UrlFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUrl(data: Partial<UrlProps> = {}): Promise<Url> {
    const url = makeUrl(data);

    await this.prisma.shortUrl.create({
      data: PrismaShortUrlMapper.toPrisma(url),
    });

    return url;
  }
}
