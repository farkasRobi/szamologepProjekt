import { calculateExpression } from './calc.js';

const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const shiftBtn = document.getElementById('shiftBtn');

// trig button elements for label swapping
const trigMap = {
  sin: { label: 'sin', invLabel: 'sin⁻¹', op: 'sin', invOp: 'asin' },
  cos: { label: 'cos', invLabel: 'cos⁻¹', op: 'cos', invOp: 'acos' },
  tan: { label: 'tan', invLabel: 'tan⁻¹', op: 'tan', invOp: 'atan' },
};
const trigButtons = Array.from(buttons).filter(b => ['sin','cos','tan'].includes(b.getAttribute('data-op')));

let expression = "";
let displayExpression = "";
let shiftActive = false;

function updateDisplay() {
  display.textContent = (shiftActive ? '[SHIFT] ' : '') + (displayExpression || "0");
}

buttons.forEach((btn) => {
  const num = btn.getAttribute("data-num");
  const op = btn.getAttribute("data-op");
  const action = btn.getAttribute("data-action");

  if (num !== null) {
    btn.addEventListener("click", () => {
      expression += num;
      displayExpression += num;
      updateDisplay();
    });
  }

  if (btn.hasAttribute('data-op')) {
    btn.addEventListener('click', () => {
      const curOp = btn.getAttribute('data-op');

      // trig and inverse trig
      if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan'].includes(curOp)) {
        const value = parseFloat(expression);
        if (isNaN(value)) return;
        let result;
        if (curOp === 'sin') result = Math.sin(value);
        if (curOp === 'cos') result = Math.cos(value);
        if (curOp === 'tan') result = Math.tan(value);
        if (curOp === 'asin') result = Math.asin(value);
        if (curOp === 'acos') result = Math.acos(value);
        if (curOp === 'atan') result = Math.atan(value);

        const resultStr = isNaN(result) ? "Hiba" : result.toString();
        expression = resultStr;
        displayExpression = `${resultStr}`;
        updateDisplay();
        return;
      }

      const displayOp = op === "*" ? "×" : op === "/" ? "÷" : op;
      expression += " " + op + " ";
      displayExpression += " " + displayOp + " ";
      updateDisplay();
    });
  }

  if (action === "equals") {
    btn.addEventListener("click", () => {
      const result = calculateExpression(expression);
      const resultStr = isNaN(result) ? "Hiba" : result.toString();
      expression = resultStr;
      displayExpression = resultStr;
      updateDisplay();
    });
  }

  if (action === "clear") {
    btn.addEventListener("click", () => {
      expression = "";
      displayExpression = "";
      updateDisplay();
    });
  }

  if (action === "dot") {
    btn.addEventListener("click", () => {
      expression += ".";
      displayExpression += ".";
      updateDisplay();
    });
  }

  if (action === 'shift') {
    btn.addEventListener('click', () => {
      shiftActive = !shiftActive;
      if (shiftBtn) {
        shiftBtn.classList.toggle('active', shiftActive);
        shiftBtn.textContent = shiftActive ? 'SHIFT' : 'shift';
      }

      trigButtons.forEach(tb => {
        const cur = tb.getAttribute('data-op');
        const base = cur && cur.startsWith('a') ? cur.slice(1) : cur; // 'asin' -> 'sin'
        const map = trigMap[base];
        if (!map) return;
        if (shiftActive) {
          tb.textContent = map.invLabel;
          tb.setAttribute('data-op', map.invOp);
          tb.classList.add('shifted');
        } else {
          tb.textContent = map.label;
          tb.setAttribute('data-op', map.op);
          tb.classList.remove('shifted');
        }
      });

      updateDisplay();
    });
  }
});

updateDisplay();
