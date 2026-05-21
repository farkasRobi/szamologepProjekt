const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";
let displayExpression = "";

function updateDisplay() {
  display.textContent = displayExpression || "0";
}

function calculateExpression(expression) {
  const parts = expression.split(" ");
  let result = parseFloat(parts[0]);

  for (let i = 1; i < parts.length; i += 2) {
    const op = parts[i];
    const num = parseFloat(parts[i + 1]);

    if (op === "+") result += num;
    if (op === "-") result -= num;
    if (op === "*") result *= num;
    if (op === "/") result /= num;
  }
  return result;
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
});

updateDisplay();