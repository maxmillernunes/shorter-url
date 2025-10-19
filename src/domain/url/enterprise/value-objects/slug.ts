import { randomInt } from 'node:crypto';
import { left, right, type Either } from '@/core/either';
import { CUSTOM_ALIAS_REGEX, RESERVED_PATHS } from '@/core/types/constants';
import { SlugRegexRulesError } from './errors/slug-regex-rules-error';
import { ReservedPathsSlugError } from './errors/reserved-paths-slug-error';

export type CreateCustomSlug = Either<
  SlugRegexRulesError | ReservedPathsSlugError,
  { slug: Slug }
>;

export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    return new Slug(value);
  }

  static createCustom(text: string): CreateCustomSlug {
    if (!CUSTOM_ALIAS_REGEX.test(text)) {
      return left(new SlugRegexRulesError());
    }

    const alias = text.toLowerCase();

    if (RESERVED_PATHS.has(alias)) {
      return left(new ReservedPathsSlugError());
    }

    return right({ slug: new Slug(alias) });
  }

  /**
   * With each run, it creates a different slug
   */
  static createRadom() {
    const CHARSET =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const SLUG_LEN = 6;

    let slugRandom = '';
    for (let i = 0; i < SLUG_LEN; i++) {
      const idx = randomInt(0, CHARSET.length); // crypto RNG
      slugRandom += CHARSET[idx];
    }

    return new Slug(slugRandom);
  }
}
