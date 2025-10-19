import { left, right, type Either } from '@/core/either';
import { UrlsRepository } from '../repositories/urls-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import type { OriginalUrl } from '../../enterprise/entities/value-objects/original-url';

interface RedirectAndCountAccessShortUrlUseCaseRequest {
  shortUrl: string;
}

type RedirectAndCountAccessShortUrlUseCaseResponse = Either<
  ResourceNotFoundError,
  { originalUrl: OriginalUrl }
>;

export class RedirectAndCountAccessShortUrlUseCase {
  constructor(private urlsRepository: UrlsRepository) {}

  async execute({
    shortUrl,
  }: RedirectAndCountAccessShortUrlUseCaseRequest): Promise<RedirectAndCountAccessShortUrlUseCaseResponse> {
    const url = await this.urlsRepository.findBySlug(shortUrl);

    if (!url) {
      return left(new ResourceNotFoundError());
    }

    url.incrementRedirect();

    await this.urlsRepository.save(url);

    return right({ originalUrl: url.originalUrl });
  }
}
