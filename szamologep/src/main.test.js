import { calculateExpression } from './calc.js';

function assertEqual(name, actual, expected) {
  const pass = actual === expected;
  const el = document.createElement('div');
  el.textContent = `${name}: ${pass ? 'PASS' : 'FAIL'} (got ${actual}, expected ${expected})`;
  el.style.color = pass ? 'green' : 'red';
  document.getElementById('results').appendChild(el);
}

document.addEventListener('DOMContentLoaded', () => {
  assertEqual('calculateExpression 1 + 2', calculateExpression('1 + 2'), 3);
  assertEqual('calculateExpression 10 - 4', calculateExpression('10 - 4'), 6);
  assertEqual('calculateExpression 3 * 5', calculateExpression('3 * 5'), 15);
  assertEqual('calculateExpression 12 / 4', calculateExpression('12 / 4'), 3);
  assertEqual('calculateExpression decimal', calculateExpression('1.5 + 2.5'), 4);
});
