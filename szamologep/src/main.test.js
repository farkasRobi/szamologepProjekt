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
  assertEqual('calculateExpression sin 0', calculateExpression('sin 0'), 0);
  assertEqual('calculateExpression cos 0', calculateExpression('cos 0'), 1);
  assertEqual('calculateExpression tan 0', calculateExpression('tan 0'), 0);
  assertEqual('calculateExpression asin 0', calculateExpression('asin 0'), 0);
  assertEqual('calculateExpression acos 1', calculateExpression('acos 1'), 0);
  assertEqual('calculateExpression atan 0', calculateExpression('atan 0'), 0);
  assertEqual('calculateExpression sin-1 0', calculateExpression('sin-1 0'), 0);
  assertEqual('calculateExpression sin(0)', calculateExpression('sin(0)'), 0);
  assertEqual('calculateExpression cos(0)', calculateExpression('cos(0)'), 1);
  assertEqual('calculateExpression 3 * (2 + 1)', calculateExpression('3 * (2 + 1)'), 9);
  assertEqual('calculateExpression sin(0) + 1', calculateExpression('sin(0) + 1'), 1);
  assertEqual('calculateExpression 2 ^ 3', calculateExpression('2 ^ 3'), 8);
  assertEqual('calculateExpression sqrt(9)', calculateExpression('sqrt(9)'), 3);
  assertEqual('calculateExpression cbrt(27)', calculateExpression('cbrt(27)'), 3);
  assertEqual('calculateExpression root(2,9)', calculateExpression('root(2,9)'), 3);
  assertEqual('calculateExpression pi', calculateExpression('pi'), Math.PI);
  assertEqual('calculateExpression 10 ^ 2', calculateExpression('10 ^ 2'), 100);
});
