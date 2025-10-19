export class SlugRegexRulesError extends Error {
  constructor() {
    super(
      'Short url invalid: use 3–30 characters alpha numeric separated with (-). Ex: my-site.',
    );
  }
}
