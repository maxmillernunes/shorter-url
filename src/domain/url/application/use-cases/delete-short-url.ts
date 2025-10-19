import { left, right, type Either } from '@/core/either';
import { UrlsRepository } from '../repositories/urls-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface DeleteShortUrlUseCaseRequest {
  id: string;
}

type DeleteShortUrlUseCaseResponse = Either<ResourceNotFoundError, null>;

export class DeleteShortUrlUseCase {
  constructor(private urlsRepository: UrlsRepository) {}

  async execute({
    id,
  }: DeleteShortUrlUseCaseRequest): Promise<DeleteShortUrlUseCaseResponse> {
    const url = await this.urlsRepository.findById(id);

    if (!url) {
      return left(new ResourceNotFoundError());
    }

    url.deletedAt = new Date();

    await this.urlsRepository.save(url);

    return right(null);
  }
}
