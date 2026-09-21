import assert from 'node:assert/strict';
import test from 'node:test';
import { categories, filterProducts, products } from '../src/data/catalog.js';

test('catalog entries have unique identifiers and required content', () => {
  assert.equal(new Set(products.map(({ id }) => id)).size, products.length);
  assert.ok(products.every(({ name, category, price, image, description }) => name && category && price > 0 && image && description));
  assert.ok(categories.every(({ name, description }) => name && description));
});

test('filterProducts searches product names, categories, and descriptions without case sensitivity', () => {
  assert.deepEqual(filterProducts('LATTE').map(({ name }) => name), ['Honey Oat Latte']);
  assert.deepEqual(filterProducts('chocolate').map(({ name }) => name), ['Cacao Celebration']);
  assert.equal(filterProducts('not-on-the-menu').length, 0);
});

test('an empty search returns the complete catalog', () => {
  assert.equal(filterProducts('   '), products);
});
