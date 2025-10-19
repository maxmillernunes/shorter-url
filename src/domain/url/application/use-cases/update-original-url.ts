import { left, right, type Either } from '@/core/either';
import { UrlsRepository } from '../repositories/urls-repository';
import type { Url } from '../../enterprise/entities/url';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { OriginalUrl } from '../../enterprise/entities/value-objects/original-url';
import { InvalidOriginalUrlError } from '../../enterprise/entities/value-objects/errors/invalid-original-url-error';
import { OriginalUrlTooLongError } from '../../enterprise/entities/value-objects/errors/original-url-too-long-error';
import { Injectable } from '@nestjs/common';

interface UpdateOriginalUrlUseCaseRequest {
  id: string;
  newOriginalUrl: string;
}

type UpdateOriginalUrlUseCaseResponse = Either<
  ResourceNotFoundError | InvalidOriginalUrlError | OriginalUrlTooLongError,
  { url: Url }
>;

@Injectable()
export class UpdateOriginalUrlUseCase {
  constructor(private urlsRepository: UrlsRepository) {}

  async execute({
    id,
    newOriginalUrl,
  }: UpdateOriginalUrlUseCaseRequest): Promise<UpdateOriginalUrlUseCaseResponse> {
    const url = await this.urlsRepository.findById(id);

    if (!url) {
      return left(new ResourceNotFoundError());
    }

    const newOriginalUrlCreated = OriginalUrl.normalize(newOriginalUrl);

    if (newOriginalUrlCreated.isLeft()) {
      return left(newOriginalUrlCreated.value);
    }

    url.originalUrl = newOriginalUrlCreated.value.originalUrl;

    await this.urlsRepository.save(url);

    return right({ url });
  }
}
