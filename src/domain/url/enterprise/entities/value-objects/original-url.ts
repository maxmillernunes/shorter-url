import { left, right, type Either } from '@/core/either';
import { ORIGINAL_URL_LENGTH } from '@/core/types/constants';
import { InvalidOriginalUrlError } from './errors/invalid-original-url-error';
import { OriginalUrlTooLongError } from './errors/original-url-too-long-error';

export type CreateOriginalUrlResponse = Either<
  InvalidOriginalUrlError | OriginalUrlTooLongError,
  { originalUrl: OriginalUrl }
>;

export class OriginalUrl {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    return new OriginalUrl(value);
  }

  static normalize(url: string): CreateOriginalUrlResponse {
    let normalized = url.trim();

    if (normalized.length > ORIGINAL_URL_LENGTH) {
      return left(new OriginalUrlTooLongError());
    }

    let parsed: URL;
    try {
      parsed = new URL(normalized);
    } catch {
      return left(new InvalidOriginalUrlError());
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return left(new InvalidOriginalUrlError());
    }

    normalized = parsed.href.replace(/\/+$/, '');

    return right({ originalUrl: new OriginalUrl(normalized) });
  }
}
