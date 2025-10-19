import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Url } from '../../enterprise/entities/url';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { UrlsRepository } from '../repositories/urls-repository';
import { left, right, type Either } from '@/core/either';
import { UserNotAuthenticatedError } from './errors/user-not-authenticated-error';
import { SlugAlreadyExistsError } from './errors/slug-already-exists-error';
import type { AliasRegexRulesError } from '../../enterprise/entities/value-objects/errors/alias-regex-rules-error';
import type { ReservedPathsAliasError } from '../../enterprise/entities/value-objects/errors/reserved-paths-alias-error';
import { OriginalUrl } from '../../enterprise/entities/value-objects/original-url';
import type { InvalidOriginalUrlError } from '../../enterprise/entities/value-objects/errors/invalid-original-url-error';
import type { OriginalUrlTooLongError } from '../../enterprise/entities/value-objects/errors/original-url-too-long-error';
import { Alias } from '../../enterprise/entities/value-objects/alias';

interface CreateShortUrlUseCaseRequest {
  userId?: string;
  alias?: string;
  originalUrl: string;
}

type CreateShortUrlUseCaseResponse = Either<
  | UserNotAuthenticatedError
  | SlugAlreadyExistsError
  | AliasRegexRulesError
  | ReservedPathsAliasError
  | InvalidOriginalUrlError
  | OriginalUrlTooLongError,
  {
    url: Url;
  }
>;

@Injectable()
export class CreateShortUrlUseCase {
  constructor(private urlsRepository: UrlsRepository) {}

  async execute({
    originalUrl,
    alias,
    userId,
  }: CreateShortUrlUseCaseRequest): Promise<CreateShortUrlUseCaseResponse> {
    let aliasCreated: Alias | undefined;
    let slugCreated: Slug;

    if (alias && !userId) {
      return left(new UserNotAuthenticatedError());
    }

    if (alias) {
      const customSlug = Alias.createCustom(alias);

      if (customSlug.isLeft()) {
        const error = customSlug.value;

        return left(error);
      }

      const existsCustomSlug = await this.urlsRepository.findByAlias(
        customSlug.value.alias.value,
      );

      if (existsCustomSlug) {
        return left(new SlugAlreadyExistsError(customSlug.value.alias.value));
      }

      aliasCreated = customSlug.value.alias;
    }

    do {
      slugCreated = Slug.createRadom();
    } while (await this.urlsRepository.findBySlug(slugCreated.value));

    const originalUrlCreated = OriginalUrl.normalize(originalUrl);

    if (originalUrlCreated.isLeft()) {
      return left(originalUrlCreated.value);
    }

    const url = Url.create({
      originalUrl: originalUrlCreated.value.originalUrl,
      slug: slugCreated,
      alias: aliasCreated,
      userId: userId ? new UniqueEntityId(userId) : null,
    });

    await this.urlsRepository.create(url);

    return right({ url });
  }
}
