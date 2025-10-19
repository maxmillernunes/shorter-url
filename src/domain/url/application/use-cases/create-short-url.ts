import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Url } from '../../enterprise/entities/url';
import { Slug } from '../../enterprise/value-objects/slug';
import { UrlsRepository } from '../repositories/urls-repository';

interface CreateShortUrlUseCaseRequest {
  userId?: string;
  slug?: string;
  originalUrl: string;
}

interface CreateShortUrlUseCaseResponse {
  url: Url;
}

export class CreateShortUrlUseCase {
  constructor(private urlsRepository: UrlsRepository) {}

  async execute({
    originalUrl,
    slug,
    userId,
  }: CreateShortUrlUseCaseRequest): Promise<CreateShortUrlUseCaseResponse> {
    const slugCreated = await this.createSlug(slug, userId);

    const url = Url.create({
      originalUrl,
      slug: slugCreated,
      userId: userId ? new UniqueEntityId(userId) : null,
    });

    await this.urlsRepository.create(url);

    return { url };
  }

  private async createSlug(slug?: string, userId?: string): Promise<Slug> {
    if (slug && !userId) {
      throw new Error(
        'It is necessary to be authenticated to create custom slug',
      );
    }

    if (slug) {
      const slugCustom = Slug.createCustom(slug);

      const existsCustomSlug = await this.urlsRepository.findBySlug(
        slugCustom.value,
      );

      if (existsCustomSlug) {
        throw new Error('Slug Already exists.');
      }

      return slugCustom;
    }

    let slugRandom: Slug;

    do {
      slugRandom = Slug.createRadom();
    } while (await this.urlsRepository.findBySlug(slugRandom.value));

    return slugRandom;
  }
}
