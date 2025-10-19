import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { UrlsRepository } from '@/domain/url/application/repositories/urls-repository';
import type { Url } from '@/domain/url/enterprise/entities/url';

export class InMemoryUrlsRepository implements UrlsRepository {
  public items: Url[] = [];

  async findById(id: string): Promise<Url | null> {
    const url = this.items.find((item) => item.id.toString() === id);

    if (!url) {
      return null;
    }

    return url;
  }

  async findBySlug(slug: string): Promise<Url | null> {
    const url = this.items.find((item) => item.slug.value === slug);

    if (!url) {
      return null;
    }

    return url;
  }

  async findManyByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<Url[]> {
    const url = this.items
      .filter((item) => item.userId?.toString() === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return url;
  }

  async create(url: Url): Promise<void> {
    this.items.push(url);
  }

  async save(url: Url): Promise<void> {
    const urlIndex = this.items.findIndex((item) => item.id === url.id);

    this.items[urlIndex] = url;
  }
}
