import type { PaginationParams } from '@/core/repositories/pagination-params';
import { UrlsRepository } from '@/domain/url/application/repositories/urls-repository';
import type { Url } from '@/domain/url/enterprise/entities/url';
import { PrismaService } from '../prisma.service';
import { PrismaShortUrlMapper } from '../mappers/prisma-url-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUrlsRepository implements UrlsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Url | null> {
    const url = await this.prisma.shortUrl.findUnique({ where: { id } });

    if (!url) {
      return null;
    }

    return PrismaShortUrlMapper.toDomain(url);
  }

  async findBySlug(slug: string): Promise<Url | null> {
    const url = await this.prisma.shortUrl.findUnique({
      where: {
        deletedAt: null,
        slug: slug,
      },
    });

    if (!url) {
      return null;
    }

    return PrismaShortUrlMapper.toDomain(url);
  }

  async findByAlias(alias: string): Promise<Url | null> {
    const url = await this.prisma.shortUrl.findUnique({
      where: { deletedAt: null, alias },
    });

    if (!url) {
      return null;
    }

    return PrismaShortUrlMapper.toDomain(url);
  }

  async findManyByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<Url[]> {
    const urls = await this.prisma.shortUrl.findMany({
      where: {
        deletedAt: null,
        userId,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 200,
    });

    return urls.map((url) => PrismaShortUrlMapper.toDomain(url));
  }

  async create(url: Url): Promise<void> {
    const data = PrismaShortUrlMapper.toPrisma(url);

    await this.prisma.shortUrl.create({ data });
  }

  async save(url: Url): Promise<void> {
    const data = PrismaShortUrlMapper.toPrisma(url);

    await this.prisma.shortUrl.update({
      where: { id: data.id },
      data,
    });
  }
}
