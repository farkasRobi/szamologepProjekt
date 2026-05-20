const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";

function updateDisplay() {
  display.textContent = expression || "0";
}

function calculateExpression(expression) {
  const parts = expression.split(" ");
  let result = parseFloat(parts[0]);

  for (let i = 1; i < parts.length; i += 2) {
    const op = parts[i];
    const num = parseFloat(parts[i + 1]);

    if (op === "+") result += num;
    if (op === "-") result -= num;
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
      updateDisplay();
    });
  }

  if (op !== null) {
    if (op === "+" || op === "-") {
      btn.addEventListener("click", () => {
        expression += " " + op + " ";
        updateDisplay();
      });
    }
  }

  if (action === "equals") {
    btn.addEventListener("click", () => {
      const result = calculateExpression(expression);
      expression = isNaN(result) ? "Hiba" : result.toString();
      updateDisplay();
    });
  }

  if (action === "clear") {
    btn.addEventListener("click", () => {
      expression = "";
      updateDisplay();
    });
  }

  if (action === "dot") {
    btn.addEventListener("click", () => {
      expression += ".";
      updateDisplay();
    });
  }
});

updateDisplay();
