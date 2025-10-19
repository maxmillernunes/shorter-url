export class OriginalUrlTooLongError extends Error {
  constructor() {
    super('Original URL too long');
  }
}
