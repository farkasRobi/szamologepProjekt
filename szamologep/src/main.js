import { calculateExpression } from './calc.js';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const shiftBtn = document.getElementById('shiftBtn');
const historyList = document.getElementById('history-list');
const historyListDel = document.getElementById('history-del');

const shiftButtons = Array.from(buttons).filter((btn) => btn.dataset.shiftOp || btn.dataset.shiftAction);

let expression = '';
let shiftActive = false;

function updateDisplay() {
  display.textContent = (expression || '0');
}

function addToHistory(expression, result){
  const historyItem = document.createElement('div');

  historyItem.classList.add('history-item');

  historyItem.innerHTML = `
    <div class="history-expression">${expression}</div>
    <div class="history-result">=${result}</div>
    `;

    historyList.prepend(historyItem);
}
historyListDel.addEventListener('click', () => {
  historyList.innerHTML='';
});

function appendToExpression(value) {
  expression += value;
  updateDisplay();
}

function expressionEndsValue() {
  return /[0-9)]$/.test(expression) || expression.endsWith('pi');
}

function currentNumberSegment() {
  let idx = expression.length - 1;
  let segment = '';
  while (idx >= 0) {
    const ch = expression[idx];
    if (/\d|\./.test(ch)) {
      segment = ch + segment;
      idx -= 1;
      continue;
    }
    break;
  }
  return segment;
}

function canAppendDot() {
  const segment = currentNumberSegment();
  return !segment.includes('.');
}

function applyShiftMode(active) {
  shiftActive = active;

  if (shiftBtn) {
    shiftBtn.classList.toggle('active', shiftActive);
    shiftBtn.textContent = shiftActive ? 'SHIFT' : 'shift';
  }

  shiftButtons.forEach((btn) => {
    const originalLabel = btn.dataset.label || btn.textContent;
    const shiftLabel = btn.dataset.shiftLabel;
    const originalOp = btn.dataset.originalOp || btn.dataset.op;
    const shiftOp = btn.dataset.shiftOp;
    const originalAction = btn.dataset.originalAction || btn.dataset.action;
    const shiftAction = btn.dataset.shiftAction;

    if (shiftActive) {
      if (shiftLabel) btn.textContent = shiftLabel;
      if (shiftOp) btn.setAttribute('data-op', shiftOp);
      if (shiftAction) btn.setAttribute('data-action', shiftAction);
    } else {
      if (btn.dataset.label) btn.textContent = originalLabel;
      if (originalOp) btn.setAttribute('data-op', originalOp);
      if (originalAction) btn.setAttribute('data-action', originalAction);
    }
  });

  updateDisplay();
}

function replaceTrailingOperator(op) {
  if (/[+\-*/^]$/.test(expression)) {
    expression = expression.slice(0, -1) + op;
    updateDisplay();
    return true;
  }
  return false;
}

function handleOperator(op) {
  if (['+', '-', '*', '/', '^'].includes(op)) {
    if (expression === '' && op !== '-') {
      return;
    }
    if (replaceTrailingOperator(op)) {
      return;
    }
    appendToExpression(op);
    return;
  }

  if (expression === '' && ['pow2', 'pow3', 'pow10', 'root'].includes(op)) {
    return;
  }

  const needsMultiplication = expressionEndsValue();
  switch (op) {
    case 'pow2':
      appendToExpression('^2');
      break;
    case 'pow3':
      appendToExpression('^3');
      break;
    case 'pow10':
      appendToExpression((needsMultiplication ? '*' : '') + 'pow(10,');
      break;
    case 'root':
      appendToExpression((needsMultiplication ? '*' : '') + 'root(');
      break;
    case '^':
      appendToExpression('^');
      break;
    case 'graf': {
      const n = parseFloat(expression);
      if (!expression || isNaN(n) || n < 0 || !Number.isInteger(n)) {
        expression = 'Hiba';
        updateDisplay();
        return;
      }
      const result = (n * (n - 1)) / 2;
      addToHistory(`pont: ${n}, él`, result.toString());
      expression = result.toString() + " élű";
      updateDisplay();
      break;
    }
    default:
      appendToExpression((needsMultiplication ? '*' : '') + op);
  }
}

buttons.forEach((btn) => {
  const num = btn.getAttribute('data-num');
  const op = btn.getAttribute('data-op');
  const action = btn.getAttribute('data-action');

  if (num !== null) {
    btn.addEventListener('click', () => {
      appendToExpression(num);
    });
  }

  if (action === 'dot' || action === 'rand') {
    btn.addEventListener('click', () => {
      if (action === 'rand') {
        appendToExpression('rand()');
      } else if (canAppendDot()) {
        if (expression === '' || /[+\-*/^(,]$/.test(expression)) {
          appendToExpression('0.');
        } else {
          appendToExpression('.');
        }
      }
    });
  }

  if (action === 'pi') {
    btn.addEventListener('click', () => {
      appendToExpression('pi');
    });
  }

  if (action === 'open-paren') {
    btn.addEventListener('click', () => {
      appendToExpression('(');
    });
  }

  if (action === 'close-paren') {
    btn.addEventListener('click', () => {
      appendToExpression(')');
    });
  }

  if (action === 'backspace') {
    btn.addEventListener('click', () => {
      const functionPatterns = ['asin(', 'acos(', 'atan(', 'sin(', 'cos(', 'tan(', 'log(', 'sqrt(', 'cbrt(', 'pow(', 'root('];
      for (const pattern of functionPatterns) {
        if (expression.endsWith(pattern)) {
          expression = expression.slice(0, -pattern.length);
          updateDisplay();
          return;
        }
      }

      if (expression.endsWith(' ')) {
        expression = expression.slice(0, -3);
      } else {
        expression = expression.slice(0, -1);
      }
      updateDisplay();
    });
  }

  if (btn.hasAttribute('data-op')) {
    btn.addEventListener('click', () => {
      const curOp = btn.getAttribute('data-op');
      handleOperator(curOp);
    });
  }

  if (action === 'equals') {
    btn.addEventListener('click', () => {
      const originalExpression = expression;
      const result = calculateExpression(expression);
      const resultStr = isNaN(result) ? 'Hiba' : result.toString();
      addToHistory(originalExpression, resultStr)
      expression = resultStr;
      updateDisplay();
    });
  }

  if (action === 'clear') {
    btn.addEventListener('click', () => {
      expression = '';
      updateDisplay();
    });
  }

  if (action === 'shift') {
    btn.addEventListener('click', () => {
      applyShiftMode(!shiftActive);
    });
  }
});

updateDisplay();
document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (!isNaN(key) && key !== ' ') {
    appendToExpression(key);
    return;
  }

  if (key === '+' || key === '-') {
    handleOperator(key);
    return;
  }

  if (key === ',') {
    expression = '';
    updateDisplay();
    return;
  }

  if (key === 'Shift'){
    applyShiftMode(!shiftActive);
    return;
      
  }

  if (key === 'Backspace') {
    const functionPatterns = [
      'asin(', 'acos(', 'atan(', 'sin(', 'cos(', 'tan(',
      'log(', 'sqrt(', 'cbrt(', 'pow(', 'root('
    ];

    for (const pattern of functionPatterns) {
      if (expression.endsWith(pattern)) {
        expression = expression.slice(0, -pattern.length);
        updateDisplay();
        return;
      }
    }
    if (expression.endsWith(' ')) {
      expression = expression.slice(0, -3);
    } else {
      expression = expression.slice(0, -1);
    }

    updateDisplay();
    return;
  }
});