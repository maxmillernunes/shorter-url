import type { UseCaseError } from '@/core/errors/use-case-error';

export class SlugAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Custom slug ${identifier} Already exists.`);
  }
}
