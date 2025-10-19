import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository';
import { makeUrl } from '@test/factories/make-short-url';
import { UpdateOriginalUrlUseCase } from './update-original-url';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { InvalidOriginalUrlError } from '../../enterprise/entities/value-objects/errors/invalid-original-url-error';
import { ORIGINAL_URL_LENGTH } from '@/core/types/constants';
import { OriginalUrlTooLongError } from '../../enterprise/entities/value-objects/errors/original-url-too-long-error';

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
      expect(result.value.url.originalUrl.value).toEqual(newOriginalUrl);
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

  it('should not be able to create url short with invalid original url', async () => {
    const url = makeUrl();
    await inMemoryUrlsRepository.create(url);

    const result = await sut.execute({
      id: url.id.toString(),
      newOriginalUrl: 'ftp://site.com.br',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidOriginalUrlError);
  });

  it('should not be able to create url short with invalid original url', async () => {
    const url = makeUrl();
    await inMemoryUrlsRepository.create(url);

    const result = await sut.execute({
      id: url.id.toString(),
      newOriginalUrl: '://site.com.br',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidOriginalUrlError);
  });

  it('should not be able to create url short with long original url', async () => {
    const url = makeUrl();
    await inMemoryUrlsRepository.create(url);

    const longUrl =
      'https://example.com/' + 'a'.repeat(ORIGINAL_URL_LENGTH + 1);

    const result = await sut.execute({
      id: url.id.toString(),
      newOriginalUrl: longUrl,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OriginalUrlTooLongError);
  });
});
