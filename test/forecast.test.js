import test from 'node:test';
import assert from 'node:assert/strict';
import { project, sample } from '../public/app.js';
test('linear series extrapolates to known future prices', () => {
  assert.deepEqual(project([10, 12, 14, 16], 3), [18, 20, 22]);
});
test('flat prices remain flat', () => {
  assert.deepEqual(project([25, 25, 25, 25], 2), [25, 25]);
});
test('declining projection cannot produce negative prices', () => {
  assert.deepEqual(project([4, 3, 2, 1], 3), [0, 0, 0]);
});
test('sample data is deterministic and has sixty positive observations', () => {
  const values = sample(190, 1);
  assert.equal(values.length, 60);
  assert.ok(values.every(v => v > 0));
  assert.deepEqual(values, sample(190, 1));
});
