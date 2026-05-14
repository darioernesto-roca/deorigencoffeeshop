import test from 'node:test';
import assert from 'node:assert/strict';
import { getMissingRequiredEnvKeys } from '../src/lib/env';

test('getMissingRequiredEnvKeys returns key when site URL is missing', () => {
  const missing = getMissingRequiredEnvKeys({});
  assert.deepEqual(missing, ['NEXT_PUBLIC_SITE_URL']);
});

test('getMissingRequiredEnvKeys returns empty when site URL exists', () => {
  const missing = getMissingRequiredEnvKeys({ NEXT_PUBLIC_SITE_URL: 'https://example.com' });
  assert.deepEqual(missing, []);
});
