import type { Url } from '@/domain/url/enterprise/entities/url';

export class UrlPresenter {
  static toHTTP(url: Url) {
    return {
      id: url.id.toString(),
      userId: url.userId?.toString(),
      originalUrl: url.originalUrl.value,
      slug: url.slug.value,
      alias: url.alias?.value,
      accessCounter: url.accessCounter,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }
}
