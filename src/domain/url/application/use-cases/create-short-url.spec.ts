import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository';
import { CreateShortUrlUseCase } from './create-short-url';
import { Slug } from '../../enterprise/value-objects/slug';
import { Url } from '../../enterprise/entities/url';

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

    expect(result).toBeTruthy();
    expect(result.url.slug.value).toEqual(expect.any(String));
    expect(inMemoryUrlsRepository.items[0]).toEqual(result.url);
  });

  it('should be able to create url short with custom slug', async () => {
    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
      slug: 'my-site',
      userId: 'user-1',
    });

    expect(result.url).toBeTruthy();
    expect(result.url.slug.value).toEqual('my-site');
    expect(inMemoryUrlsRepository.items[0]).toEqual(result.url);
  });

  it('should not be able to create url short with not authenticated user', async () => {
    await expect(() =>
      sut.execute({
        originalUrl: 'https://site.com.br',
        slug: 'my-site',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to create url short with custom slug wrong', async () => {
    await expect(() =>
      sut.execute({
        originalUrl: 'https://site.com.br',
        slug: 'meu site de apostas',
        userId: 'user-1',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to create url short with custom slug reserved', async () => {
    await expect(() =>
      sut.execute({
        originalUrl: 'https://site.com.br',
        slug: 'auth',
        userId: 'user-1',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to create url short When occurs to conflict', async () => {
    const mockSlug1 = Slug.create('ABC123');
    const mockSlug2 = Slug.create('XYZ999');

    const spyCreateRandom = jest
      .spyOn(Slug, 'createRadom')
      .mockReturnValueOnce(mockSlug1) // first try (does not working)
      .mockReturnValueOnce(mockSlug2); // second try (working)

    const url = Url.create({
      originalUrl: 'https://existing.com',
      slug: mockSlug1,
    });
    await inMemoryUrlsRepository.create(url);

    const result = await sut.execute({
      originalUrl: 'https://site.com.br',
    });

    expect(result.url.slug.value).toBe(mockSlug2.value);
    expect(spyCreateRandom).toHaveBeenCalledTimes(2);
    expect(inMemoryUrlsRepository.items[1].slug).toBe(mockSlug2);

    spyCreateRandom.mockRestore();
  });
});
