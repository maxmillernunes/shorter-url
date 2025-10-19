import { CHARSET, SLUG_LEN } from '@/core/types/constants';
import { randomInt } from 'node:crypto';

export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    return new Slug(value);
  }

  /**
   * With each run, it creates a different slug
   */
  static createRadom() {
    let slugRandom = '';
    for (let i = 0; i < SLUG_LEN; i++) {
      const idx = randomInt(0, CHARSET.length); // crypto RNG
      slugRandom += CHARSET[idx];
    }

    return new Slug(slugRandom);
  }
}
