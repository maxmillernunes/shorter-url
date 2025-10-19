import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Url, type UrlProps } from '@/domain/url/enterprise/entities/url';
import { Slug } from '@/domain/url/enterprise/value-objects/slug';

export function makeUrl(override: Partial<UrlProps> = {}, id?: UniqueEntityId) {
  const url = Url.create(
    {
      originalUrl: faker.internet.url(),
      slug: Slug.createRadom(),
      ...override,
    },
    id,
  );

  return url;
}
