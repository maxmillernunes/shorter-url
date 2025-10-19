import { left, right, type Either } from '@/core/either';
import { UrlsRepository } from '../repositories/urls-repository';
import type { Url } from '../../enterprise/entities/url';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface UpdateOriginalUrlUseCaseRequest {
  id: string;
  newOriginalUrl: string;
}

type UpdateOriginalUrlUseCaseResponse = Either<
  ResourceNotFoundError,
  { url: Url }
>;

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

    url.originalUrl = newOriginalUrl;

    await this.urlsRepository.save(url);

    return right({ url });
  }
}
