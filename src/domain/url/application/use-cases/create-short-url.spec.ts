import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository';
import { CreateShortUrlUseCase } from './create-short-url';
import { Alias } from '../../enterprise/entities/value-objects/alias';
import { Url } from '../../enterprise/entities/url';
import { UserNotAuthenticatedError } from './errors/user-not-authenticated-error';
import { AliasRegexRulesError } from '../../enterprise/entities/value-objects/errors/alias-regex-rules-error';
import { ReservedPathsAliasError } from '../../enterprise/entities/value-objects/errors/reserved-paths-alias-error';
import { OriginalUrl } from '../../enterprise/entities/value-objects/original-url';
import { InvalidOriginalUrlError } from '../../enterprise/entities/value-objects/errors/invalid-original-url-error';
import { ORIGINAL_URL_LENGTH } from '@/core/types/constants';
import { OriginalUrlTooLongError } from '../../enterprise/entities/value-objects/errors/original-url-too-long-error';
import { Slug } from '../../enterprise/entities/value-objects/slug';

let inMemoryUrlsRepository: InMemoryUrlsRepository;
let sut: CreateShortUrlUseCase;

describe('Create Short URL', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository();
    sut = new CreateShortUrlUseCase(inMemoryUrlsRepository);
  });

  it('should be able to create url short', async () => {
    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
    });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.url.slug).toBeInstanceOf(Slug);
      expect(result.value.url.slug.value).toEqual(expect.any(String));
      expect(inMemoryUrlsRepository.items[0]).toEqual(result.value.url);
    }
  });

  it('should be able to create url short with custom alias', async () => {
    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
      alias: 'my-site',
      userId: 'user-1',
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.url.slug).toBeInstanceOf(Slug);
      expect(result.value.url.alias).toBeInstanceOf(Alias);
      expect(result.value.url.alias!.value).toEqual('my-site');
      expect(inMemoryUrlsRepository.items[0]).toEqual(result.value.url);
    }
  });

  it('should be able to create url short normalizing the original url', async () => {
    const result = await sut.execute({
      originalUrl: ' https://site.com.br ',
      alias: 'my-site',
      userId: 'user-1',
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.url.originalUrl).toBeInstanceOf(OriginalUrl);
      expect(result.value.url.alias!.value).toEqual('my-site');
      expect(inMemoryUrlsRepository.items[0].originalUrl.value).toEqual(
        'https://site.com.br',
      );
    }
  });

  it('should be able to create url short When occurs to conflict', async () => {
    const mockAlias1 = Slug.create('ABC123');
    const mockAlias2 = Slug.create('XYZ999');

    const spyCreateRandom = jest
      .spyOn(Slug, 'createRadom')
      .mockReturnValueOnce(mockAlias1) // first try (does not working)
      .mockReturnValueOnce(mockAlias2); // second try (working)

    const url = Url.create({
      originalUrl: OriginalUrl.create('https://existing.com'),
      slug: mockAlias1,
    });
    await inMemoryUrlsRepository.create(url);

    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
    });

    if (result.isRight()) {
      expect(result.value.url.slug).toBeInstanceOf(Slug);
      expect(result.value.url.originalUrl).toBeInstanceOf(OriginalUrl);
      expect(result.value.url.slug.value).toBe(mockAlias2.value);
      expect(spyCreateRandom).toHaveBeenCalledTimes(2);
      expect(inMemoryUrlsRepository.items[1].slug).toBe(mockAlias2);
    }

    spyCreateRandom.mockRestore();
  });

  it('should not be able to create url short with not authenticated user', async () => {
    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
      alias: 'my-site',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAuthenticatedError);
  });

  it('should not be able to create url short with custom alias wrong', async () => {
    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
      alias: 'meu site de apostas',
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AliasRegexRulesError);
  });

  it('should not be able to create url short with custom alias reserved', async () => {
    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
      alias: 'auth',
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ReservedPathsAliasError);
  });

  it('should not be able to create url short with invalid original url', async () => {
    const result = await sut.execute({
      originalUrl: 'ftp://site.com.br',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidOriginalUrlError);
  });

  it('should not be able to create url short with invalid original url', async () => {
    const result = await sut.execute({
      originalUrl: '://site.com.br',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidOriginalUrlError);
  });

  it('should not be able to create url short with long original url', async () => {
    const longUrl =
      'https://example.com/' + 'a'.repeat(ORIGINAL_URL_LENGTH + 1);
    const result = await sut.execute({
      originalUrl: longUrl,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OriginalUrlTooLongError);
  });
});
