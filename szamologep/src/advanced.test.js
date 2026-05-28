import test from 'node:test';
import assert from 'node:assert/strict';

import {
  differentiate,
  integrateDefinite,
  solveQuadratic,
  solveCubic,
  standardDeviation,
  sequenceNthTerm,
  sequenceSum,
  quartiles,
} from './advancedMath.js';

test('deriválás helyes', () => {
  const derivative = differentiate('x^2 + 3*x', 'x').replace(/\s+/g, '');
  assert.equal(derivative, '2*x+3');
});

test('határozott integrál helyes', () => {
  assert.equal(integrateDefinite('x', 'x', 0, 2), 2);
});

test('másodfokú megoldó helyes', () => {
  const roots = solveQuadratic(1, -3, 2).map((value) => Number(value));
  assert.ok(roots.includes(1));
  assert.ok(roots.includes(2));
});

test('harmadfokú megoldó helyes', () => {
  const roots = solveCubic(1, -6, 11, -6).map((value) => Number(value));
  assert.ok(roots.some((root) => Math.abs(root - 1) < 1e-6));
  assert.ok(roots.some((root) => Math.abs(root - 2) < 1e-6));
  assert.ok(roots.some((root) => Math.abs(root - 3) < 1e-6));
});

test('szórás számítás helyes', () => {
  assert.ok(Math.abs(standardDeviation([1, 2, 3, 4]) - 1.118033988749895) < 1e-9);
});

test('arithmetic sorozat n-edik elem és összeg', () => {
  assert.equal(sequenceNthTerm('arithmetic', 2, 3, 5), 14);
  assert.equal(sequenceSum('arithmetic', 2, 3, 5), 40);
});

test('geometric sorozat n-edik elem és összeg', () => {
  assert.equal(sequenceNthTerm('geometric', 2, 3, 4), 54);
  assert.equal(sequenceSum('geometric', 2, 3, 4), 80);
});

test('tartomány és kvartilisek számítása', () => {
  const stats = quartiles([1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(stats.range, 7);
  assert.ok(Math.abs(stats.q1 - 2.75) < 1e-9);
  assert.ok(Math.abs(stats.q2 - 4.5) < 1e-9);
  assert.ok(Math.abs(stats.q3 - 6.25) < 1e-9);
});
