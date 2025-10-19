import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository';
import { CreateShortUrlUseCase } from './create-short-url';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { Url } from '../../enterprise/entities/url';
import { UserNotAuthenticatedError } from './errors/user-not-authenticated-error';
import { SlugRegexRulesError } from '../../enterprise/entities/value-objects/errors/slug-regex-rules-error';
import { ReservedPathsSlugError } from '../../enterprise/entities/value-objects/errors/reserved-paths-slug-error';
import { OriginalUrl } from '../../enterprise/entities/value-objects/original-url';
import { InvalidOriginalUrlError } from '../../enterprise/entities/value-objects/errors/invalid-original-url-error';
import { ORIGINAL_URL_LENGTH } from '@/core/types/constants';
import { OriginalUrlTooLongError } from '../../enterprise/entities/value-objects/errors/original-url-too-long-error';

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

  it('should be able to create url short with custom slug', async () => {
    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
      slug: 'my-site',
      userId: 'user-1',
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.url.slug).toBeInstanceOf(Slug);
      expect(result.value.url.slug.value).toEqual('my-site');
      expect(inMemoryUrlsRepository.items[0]).toEqual(result.value.url);
    }
  });

  it('should be able to create url short normalizing the original url', async () => {
    const result = await sut.execute({
      originalUrl: ' https://site.com.br ',
      slug: 'my-site',
      userId: 'user-1',
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.url.originalUrl).toBeInstanceOf(OriginalUrl);
      expect(result.value.url.slug.value).toEqual('my-site');
      expect(inMemoryUrlsRepository.items[0].originalUrl.value).toEqual(
        'https://site.com.br',
      );
    }
  });

  it('should be able to create url short When occurs to conflict', async () => {
    const mockSlug1 = Slug.create('ABC123');
    const mockSlug2 = Slug.create('XYZ999');

    const spyCreateRandom = jest
      .spyOn(Slug, 'createRadom')
      .mockReturnValueOnce(mockSlug1) // first try (does not working)
      .mockReturnValueOnce(mockSlug2); // second try (working)

    const url = Url.create({
      originalUrl: OriginalUrl.create('https://existing.com'),
      slug: mockSlug1,
    });
    await inMemoryUrlsRepository.create(url);

    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
    });

    if (result.isRight()) {
      expect(result.value.url.slug).toBeInstanceOf(Slug);
      expect(result.value.url.originalUrl).toBeInstanceOf(OriginalUrl);
      expect(result.value.url.slug.value).toBe(mockSlug2.value);
      expect(spyCreateRandom).toHaveBeenCalledTimes(2);
      expect(inMemoryUrlsRepository.items[1].slug).toBe(mockSlug2);
    }

    spyCreateRandom.mockRestore();
  });

  it('should not be able to create url short with not authenticated user', async () => {
    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
      slug: 'my-site',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAuthenticatedError);
  });

  it('should not be able to create url short with custom slug wrong', async () => {
    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
      slug: 'meu site de apostas',
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SlugRegexRulesError);
  });

  it('should not be able to create url short with custom slug reserved', async () => {
    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
      slug: 'auth',
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ReservedPathsSlugError);
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
