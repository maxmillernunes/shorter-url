import * as crypto from 'node:crypto';
import { Slug } from './slug';
import { SlugRegexRulesError } from './errors/slug-regex-rules-error';
import { ReservedPathsSlugError } from './errors/reserved-paths-slug-error';

describe('Slug value object', () => {
  it('should create a slug from raw value', () => {
    const slug = Slug.create('CustomValue');

    expect(slug).toBeInstanceOf(Slug);
    expect(slug.value).toBe('CustomValue');
  });

  it('should create custom slug when value matches regex and is not reserved', () => {
    const result = Slug.createCustom('My-Site');

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.slug).toBeInstanceOf(Slug);
      expect(result.value.slug.value).toBe('my-site');
    }
  });

  it('should not create custom slug when value does not match regex', () => {
    const result = Slug.createCustom('my site');

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(SlugRegexRulesError);
  });

  it('should not create custom slug when value is a reserved path', () => {
    const result = Slug.createCustom('auth');

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ReservedPathsSlugError);
  });

  it('createRadom should return a slug of length 6 with allowed characters', () => {
    const slug = Slug.createRadom();

    expect(slug).toBeInstanceOf(Slug);
    expect(slug.value).toMatch(/^[A-Za-z0-9]{6}$/);
  });
});
