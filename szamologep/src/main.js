import { calculateExpression } from './calc.js';

const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";
let displayExpression = "";

function updateDisplay() {
  display.textContent = displayExpression || "0";
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

  if (op !== null) {
    btn.addEventListener("click", () => {
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

  if (action === "sin" || action === "cos" || action === "tan") {
    btn.addEventListener("click", () => {
      const value = parseFloat(expression);
      let result;
      if (action === "sin"){
        result = Math.sin(value);
      }
      if (action === "cos"){
        result = Math.cos(value);
      }
      if (action === "tan"){
        result = Math.tan(value);
      }
      const resultStr = isNaN(result) ? "Hiba" : result.toString();
      expression = resultStr;
      displayExpression = `${resultStr}`;
      updateDisplay();
    });
  }
});

updateDisplay();