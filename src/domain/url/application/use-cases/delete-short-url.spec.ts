import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository';
import { makeUrl } from '@test/factories/make-short-url';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DeleteShortUrlUseCase } from './delete-short-url';

let inMemoryUrlsRepository: InMemoryUrlsRepository;
let sut: DeleteShortUrlUseCase;

describe('Delete Short URL', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository();
    sut = new DeleteShortUrlUseCase(inMemoryUrlsRepository);
  });

  it('should be able to delete original url ', async () => {
    const url = makeUrl();

    await inMemoryUrlsRepository.create(url);

    const result = await sut.execute({
      id: url.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryUrlsRepository.items[0].deletedAt).toEqual(expect.any(Date));
  });

  it('should not be able to delete original url when does not exists short url created', async () => {
    const result = await sut.execute({
      id: 'non-existing-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
