import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Url } from '../../enterprise/entities/url';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { UrlsRepository } from '../repositories/urls-repository';
import { left, right, type Either } from '@/core/either';
import { UserNotAuthenticatedError } from './errors/user-not-authenticated-error';
import { SlugAlreadyExistsError } from './errors/slug-already-exists-error';
import type { SlugRegexRulesError } from '../../enterprise/entities/value-objects/errors/slug-regex-rules-error';
import type { ReservedPathsSlugError } from '../../enterprise/entities/value-objects/errors/reserved-paths-slug-error';

interface CreateShortUrlUseCaseRequest {
  userId?: string;
  slug?: string;
  originalUrl: string;
}

type CreateShortUrlUseCaseResponse = Either<
  | UserNotAuthenticatedError
  | SlugAlreadyExistsError
  | SlugRegexRulesError
  | ReservedPathsSlugError,
  {
    url: Url;
  }
>;

export class CreateShortUrlUseCase {
  constructor(private urlsRepository: UrlsRepository) {}

  async execute({
    originalUrl,
    slug,
    userId,
  }: CreateShortUrlUseCaseRequest): Promise<CreateShortUrlUseCaseResponse> {
    let slugCreated: Slug;

    if (slug && !userId) {
      return left(new UserNotAuthenticatedError());
    }

    if (slug) {
      const customSlug = Slug.createCustom(slug);

      if (customSlug.isLeft()) {
        const error = customSlug.value;

        return left(error);
      }

      const existsCustomSlug = await this.urlsRepository.findBySlug(
        customSlug.value.slug.value,
      );

      if (existsCustomSlug) {
        return left(new SlugAlreadyExistsError(customSlug.value.slug.value));
      }

      slugCreated = customSlug.value.slug;
    } else {
      do {
        slugCreated = Slug.createRadom();
      } while (await this.urlsRepository.findBySlug(slugCreated.value));
    }

    const url = Url.create({
      originalUrl,
      slug: slugCreated,
      userId: userId ? new UniqueEntityId(userId) : null,
    });

    await this.urlsRepository.create(url);

    return right({ url });
  }
}
