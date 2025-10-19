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

export const ACCESS_COUNT = 1;

export const ORIGINAL_URL_LENGTH = 2048;

export const CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const SLUG_LEN = 6;
