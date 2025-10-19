import { Alias } from './alias';
import { AliasRegexRulesError } from './errors/alias-regex-rules-error';
import { ReservedPathsAliasError } from './errors/reserved-paths-alias-error';

describe('Alias value object', () => {
  it('should create a alias from raw value', () => {
    const alias = Alias.create('CustomValue');

    expect(alias).toBeInstanceOf(Alias);
    expect(alias.value).toBe('CustomValue');
  });

  it('should create custom alias when value matches regex and is not reserved', () => {
    const result = Alias.createCustom('My-Site');

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.alias).toBeInstanceOf(Alias);
      expect(result.value.alias.value).toBe('my-site');
    }
  });

  it('should not create custom alias when value does not match regex', () => {
    const result = Alias.createCustom('my site');

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AliasRegexRulesError);
  });

  it('should not create custom alias when value is a reserved path', () => {
    const result = Alias.createCustom('auth');

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ReservedPathsAliasError);
  });
});
