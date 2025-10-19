import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository';
import { makeUrl } from '@test/factories/make-short-url';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { RedirectAndCountAccessShortUrlUseCase } from './redirect-and-count-access-short-url';

let inMemoryUrlsRepository: InMemoryUrlsRepository;
let sut: RedirectAndCountAccessShortUrlUseCase;

describe('Redirect And Count Short Url', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository();
    sut = new RedirectAndCountAccessShortUrlUseCase(inMemoryUrlsRepository);
  });

  it('should be able to redirect and count shot url original url ', async () => {
    const url = makeUrl();

    await inMemoryUrlsRepository.create(url);

    const result = await sut.execute({
      shortUrl: url.slug.value,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryUrlsRepository.items[0].accessCounter).toEqual(1);
  });

  it('should be able to redirect and count shot url original url ', async () => {
    const url = makeUrl();

    await inMemoryUrlsRepository.create(url);

    await sut.execute({
      shortUrl: url.slug.value,
    });

    const result = await sut.execute({
      shortUrl: url.slug.value,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryUrlsRepository.items[0].accessCounter).toEqual(2);
  });

  it('should not be able to delete original url when does not exists short url created', async () => {
    const result = await sut.execute({
      shortUrl: 'non-existing-short-url',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
