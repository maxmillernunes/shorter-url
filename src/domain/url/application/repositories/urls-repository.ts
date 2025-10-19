import type { Url } from '../../enterprise/entities/url';

export abstract class UrlsRepository {
  abstract findById(id: string): Promise<Url | null>;
  abstract findBySlug(slug: string): Promise<Url | null>;
  abstract findManyByUserId(userId: string): Promise<Url[]>;
  abstract create(url: Url): Promise<void>;
  abstract save(url: Url): Promise<void>;
}
