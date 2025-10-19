import { OriginalUrl } from './original-url';
import { InvalidOriginalUrlError } from './errors/invalid-original-url-error';
import { OriginalUrlTooLongError } from './errors/original-url-too-long-error';
import { ORIGINAL_URL_LENGTH } from '@/core/types/constants';

describe('OriginalUrl value object', () => {
  it('should create original url from raw value', () => {
    const original = OriginalUrl.create('https://site.com');

    expect(original).toBeInstanceOf(OriginalUrl);
    expect(original.value).toBe('https://site.com');
  });

  it('should normalize by trimming and removing trailing slashes', () => {
    const result = OriginalUrl.normalize(' https://site.com.br/ ');

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.originalUrl.value).toBe('https://site.com.br');
    }
  });

  it('should remove multiple trailing slashes when normalizing', () => {
    const result = OriginalUrl.normalize('https://site.com///');

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.originalUrl.value).toBe('https://site.com');
    }
  });

  it('should not normalize malformed urls', () => {
    const result = OriginalUrl.normalize('://site.com.br');

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidOriginalUrlError);
    }
  });

  it('should not normalize urls with unsupported protocol', () => {
    const result = OriginalUrl.normalize('ftp://site.com.br');

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidOriginalUrlError);
    }
  });

  it('should not normalize too long url', () => {
    const longUrl =
      'https://example.com/' + 'a'.repeat(ORIGINAL_URL_LENGTH + 1);
    const result = OriginalUrl.normalize(longUrl);

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(OriginalUrlTooLongError);
    }
  });
});
