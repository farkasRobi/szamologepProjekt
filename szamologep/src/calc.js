export function calculateExpression(expression) {
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
