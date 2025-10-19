import { Slug } from './slug';

describe('Slug value object', () => {
  it('should create a slug from raw value', () => {
    const slug = Slug.create('CustomValue');

    expect(slug).toBeInstanceOf(Slug);
    expect(slug.value).toBe('CustomValue');
  });

  it('createRadom should return a slug of length 6 with allowed characters', () => {
    const slug = Slug.createRadom();

    expect(slug).toBeInstanceOf(Slug);
    expect(slug.value).toMatch(/^[A-Za-z0-9]{6}$/);
  });
});
