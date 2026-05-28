import { parseNumberList, differentiate, integrateIndefinite, integrateDefinite, solveQuadratic, solveCubic, standardDeviation, sequenceNthTerm, sequenceSum, quartiles } from './advancedMath.js';

const derivativeForm = document.getElementById('derivative-form');
const derivativeInput = document.getElementById('derivative-input');
const derivativeVariable = document.getElementById('derivative-variable');
const derivativeResult = document.getElementById('derivative-result');

const indefiniteForm = document.getElementById('indefinite-form');
const indefiniteInput = document.getElementById('indefinite-input');
const indefiniteVariable = document.getElementById('indefinite-variable');
const indefiniteResult = document.getElementById('indefinite-result');

const definiteForm = document.getElementById('definite-form');
const definiteInput = document.getElementById('definite-input');
const definiteVariable = document.getElementById('definite-variable');
const definiteLower = document.getElementById('definite-lower');
const definiteUpper = document.getElementById('definite-upper');
const definiteResult = document.getElementById('definite-result');

const quadraticForm = document.getElementById('quadratic-form');
const quadraticA = document.getElementById('quadratic-a');
const quadraticB = document.getElementById('quadratic-b');
const quadraticC = document.getElementById('quadratic-c');
const quadraticResult = document.getElementById('quadratic-result');

const cubicForm = document.getElementById('cubic-form');
const cubicA = document.getElementById('cubic-a');
const cubicB = document.getElementById('cubic-b');
const cubicC = document.getElementById('cubic-c');
const cubicD = document.getElementById('cubic-d');
const cubicResult = document.getElementById('cubic-result');

const stdForm = document.getElementById('std-form');
const stdInput = document.getElementById('std-input');
const stdResult = document.getElementById('std-result');

const sequenceForm = document.getElementById('sequence-form');
const sequenceType = document.getElementById('sequence-type');
const sequenceFirst = document.getElementById('sequence-first');
const sequenceStep = document.getElementById('sequence-step');
const sequenceN = document.getElementById('sequence-n');
const nthResult = document.getElementById('nth-result');
const sumResult = document.getElementById('sum-result');

const quartileForm = document.getElementById('quartile-form');
const quartileInput = document.getElementById('quartile-input');
const quartileResult = document.getElementById('quartile-result');

function setResult(element, value) {
  element.textContent = value;
}


derivativeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const expression = derivativeInput.value.trim();
  const variable = derivativeVariable.value.trim() || 'x';

  if (!expression) {
    setResult(derivativeResult, 'Add meg egy kifejezést.');
    return;
  }

  try {
    const result = differentiate(expression, variable);
    setResult(derivativeResult, result);
  } catch (error) {
    setResult(derivativeResult, `Hiba: ${error.message}`);
  }
});

indefiniteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const expression = indefiniteInput.value.trim();
  const variable = indefiniteVariable.value.trim() || 'x';

  if (!expression) {
    setResult(indefiniteResult, 'Add meg egy kifejezést.');
    return;
  }

  try {
    const result = integrateIndefinite(expression, variable);
    setResult(indefiniteResult, result);
  } catch (error) {
    setResult(indefiniteResult, `Hiba: ${error.message}`);
  }
});

definiteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const expression = definiteInput.value.trim();
  const variable = definiteVariable.value.trim() || 'x';
  const lowerBound = Number(definiteLower.value);
  const upperBound = Number(definiteUpper.value);

  if (!expression) {
    setResult(definiteResult, 'Add meg egy kifejezést.');
    return;
  }

  try {
    const result = integrateDefinite(expression, variable, lowerBound, upperBound);
    setResult(definiteResult, String(result));
  } catch (error) {
    setResult(definiteResult, `Hiba: ${error.message}`);
  }
});

quadraticForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const a = Number(quadraticA.value);
  const b = Number(quadraticB.value);
  const c = Number(quadraticC.value);

  try {
    const roots = solveQuadratic(a, b, c);
    setResult(quadraticResult, roots.join(' , '));
  } catch (error) {
    setResult(quadraticResult, `Hiba: ${error.message}`);
  }
});

cubicForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const a = Number(cubicA.value);
  const b = Number(cubicB.value);
  const c = Number(cubicC.value);
  const d = Number(cubicD.value);

  try {
    const roots = solveCubic(a, b, c, d);
    setResult(cubicResult, roots.join(' , '));
  } catch (error) {
    setResult(cubicResult, `Hiba: ${error.message}`);
  }
});

stdForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = parseNumberList(stdInput.value);

  if (values.length === 0) {
    setResult(stdResult, 'Adj meg legalább egy számot.');
    return;
  }

  const result = standardDeviation(values);
  setResult(stdResult, `Szórás: ${result.toFixed(6)}`);
});

sequenceForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const type = sequenceType.value;
  const firstTerm = Number(sequenceFirst.value);
  const step = Number(sequenceStep.value);
  const n = Number(sequenceN.value);

  try {
    const nth = sequenceNthTerm(type, firstTerm, step, n);
    const sum = sequenceSum(type, firstTerm, step, n);
    setResult(nthResult, `n-edik elem: ${nth}`);
    setResult(sumResult, `Összeg: ${sum}`);
  } catch (error) {
    setResult(nthResult, `Hiba: ${error.message}`);
    setResult(sumResult, `Hiba: ${error.message}`);
  }
});

quartileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = parseNumberList(quartileInput.value);

  if (values.length === 0) {
    setResult(quartileResult, 'Adj meg legalább egy számot.');
    return;
  }

  const stats = quartiles(values);
  setResult(
    quartileResult,
    `Tartomány: ${stats.range} | min: ${stats.min} | Q1: ${stats.q1} | Q2: ${stats.q2} | Q3: ${stats.q3}`
  );
});
