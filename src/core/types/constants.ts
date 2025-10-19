export const CUSTOM_ALIAS_REGEX = /^[a-z0-9-_]{3,30}$/i;

export const RESERVED_PATHS = new Set([
  'auth',
  'login',
  'register',
  'docs',
  'api',
  'admin',
  'health',
  'metrics',
  'status',
  'shorten',
]);
