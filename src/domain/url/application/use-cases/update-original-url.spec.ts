import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository';
import { makeUrl } from '@test/factories/make-short-url';
import { UpdateOriginalUrlUseCase } from './update-original-url';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

let inMemoryUrlsRepository: InMemoryUrlsRepository;
let sut: UpdateOriginalUrlUseCase;

describe('Update Original URL', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository();
    sut = new UpdateOriginalUrlUseCase(inMemoryUrlsRepository);
  });

  it('should be able to update original url', async () => {
    const newOriginalUrl = 'http://new-original-url.com.br';
    const url = makeUrl();

    await inMemoryUrlsRepository.create(url);

    const result = await sut.execute({
      id: url.id.toString(),
      newOriginalUrl,
    });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.url.originalUrl).toEqual(newOriginalUrl);
    }
  });

  it('should not be able to update original url when does not exists short url created', async () => {
    const result = await sut.execute({
      id: 'non-existing-id',
      newOriginalUrl: 'http://new-original-url.com.br',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
