import type { UseCaseError } from '@/core/errors/use-case-error';

export class UserNotAuthenticatedError extends Error implements UseCaseError {
  constructor() {
    super('It is necessary to be authenticated to create custom slug');
  }
}
