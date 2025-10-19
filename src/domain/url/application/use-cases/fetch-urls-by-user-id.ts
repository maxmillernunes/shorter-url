import { right, type Either } from '@/core/either';
import { UrlsRepository } from '../repositories/urls-repository';
import type { Url } from '../../enterprise/entities/url';
import { Injectable } from '@nestjs/common';

interface FetchUrlsByUserIdUseCaseRequest {
  page: number;
  userId: string;
}

type FetchUrlsByUserIdUseCaseResponse = Either<null, { urls: Url[] }>;

@Injectable()
export class FetchUrlsByUserIdUseCase {
  constructor(private urlsRepository: UrlsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUrlsByUserIdUseCaseRequest): Promise<FetchUrlsByUserIdUseCaseResponse> {
    const urls = await this.urlsRepository.findManyByUserId(userId, { page });

    return right({ urls });
  }
}
