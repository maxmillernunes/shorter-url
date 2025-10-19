import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';
import { Slug } from './value-objects/slug';
import { ACCESS_COUNT } from '@/core/types/constants';
import { OriginalUrl } from './value-objects/original-url';

export interface UrlProps {
  userId?: UniqueEntityId | null;
  originalUrl: OriginalUrl;
  slug: Slug;
  accessCounter?: number | null;
  createdAt: Date;
  updateAt?: Date | null;
  deletedAt?: Date | null;
}

export class Url extends Entity<UrlProps> {
  get userId() {
    return this.props.userId;
  }

  get originalUrl() {
    return this.props.originalUrl;
  }

  get slug() {
    return this.props.slug;
  }

  get accessCounter(): number | null | undefined {
    return this.props.accessCounter;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updateAt() {
    return this.props.updateAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  private touch() {
    this.props.updateAt = new Date();
  }

  set originalUrl(originalUrl: OriginalUrl) {
    this.props.originalUrl = originalUrl;

    this.touch();
  }

  set deletedAt(deletedAt: Date) {
    this.props.deletedAt = deletedAt;

    this.touch();
  }

  public incrementRedirect(): void {
    if (
      this.props.accessCounter === undefined ||
      this.props.accessCounter === null
    ) {
      this.props.accessCounter = ACCESS_COUNT;
    } else {
      this.props.accessCounter = this.props.accessCounter + ACCESS_COUNT;
    }

    this.touch();
  }

  static create(props: Optional<UrlProps, 'createdAt'>, id?: UniqueEntityId) {
    const url = new Url(
      {
        ...props,
        userId: props.userId ?? null,
        slug: props.slug,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return url;
  }
}
