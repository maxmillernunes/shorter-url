import { left, right, type Either } from '@/core/either';
import { CUSTOM_ALIAS_REGEX, RESERVED_PATHS } from '@/core/types/constants';
import { AliasRegexRulesError } from './errors/alias-regex-rules-error';
import { ReservedPathsAliasError } from './errors/reserved-paths-alias-error';

export type CreateCustomAlias = Either<
  AliasRegexRulesError | ReservedPathsAliasError,
  { alias: Alias }
>;

export class Alias {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    return new Alias(value);
  }

  static createCustom(text: string): CreateCustomAlias {
    if (!CUSTOM_ALIAS_REGEX.test(text)) {
      return left(new AliasRegexRulesError());
    }

    const alias = text.toLowerCase();

    if (RESERVED_PATHS.has(alias)) {
      return left(new ReservedPathsAliasError());
    }

    return right({ alias: new Alias(alias) });
  }
}
