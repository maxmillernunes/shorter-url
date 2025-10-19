import { CUSTOM_ALIAS_REGEX, RESERVED_PATHS } from '@/core/types/constants';
import { randomInt } from 'node:crypto';

export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    return new Slug(value);
  }

  static createCustom(text: string) {
    if (!CUSTOM_ALIAS_REGEX.test(text)) {
      throw new Error(
        'Short url invalid: use 3–30 characters alpha numeric separated with (-). Ex: my-site.',
      );
    }

    const alias = text.toLowerCase();

    if (RESERVED_PATHS.has(alias)) {
      throw new Error('Short invalid');
    }

    return new Slug(alias);
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
