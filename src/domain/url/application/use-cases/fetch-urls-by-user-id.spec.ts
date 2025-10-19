import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository';
import { makeUrl } from '@test/factories/make-short-url';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { FetchUrlsByUserIdUseCase } from './fetch-urls-by-user-id';

let inMemoryUrlsRepository: InMemoryUrlsRepository;
let sut: FetchUrlsByUserIdUseCase;

describe('Fetch Urls By User Id', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository();
    sut = new FetchUrlsByUserIdUseCase(inMemoryUrlsRepository);
  });

  it('should be able to fetch urls by user id', async () => {
    const userId = new UniqueEntityId('user-1');

    inMemoryUrlsRepository.create(
      makeUrl({
        userId,
        createdAt: new Date(2025, 0, 21),
      }),
    );
    inMemoryUrlsRepository.create(
      makeUrl({
        userId,
        createdAt: new Date(2025, 0, 22),
      }),
    );

    const result = await sut.execute({
      page: 1,
      userId: userId.toString(),
    });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.urls).toHaveLength(2);
      expect(result.value.urls).toEqual([
        expect.objectContaining({ userId, createdAt: new Date(2025, 0, 22) }),
        expect.objectContaining({ userId, createdAt: new Date(2025, 0, 21) }),
      ]);
    }
  });

  it('should be able to fetch urls by user id paginated', async () => {
    const userId = new UniqueEntityId('user-1');

    for (let i = 1; i <= 22; i++) {
      inMemoryUrlsRepository.create(
        makeUrl({
          userId,
          createdAt: new Date(2025, 0, i),
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      userId: userId.toString(),
    });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.urls).toHaveLength(2);
      expect(result.value.urls).toEqual([
        expect.objectContaining({ userId }),
        expect.objectContaining({ userId }),
      ]);
    }
  });
});
