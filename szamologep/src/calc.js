const functions = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
};

function parseOperand(parts, index) {
  const token = parts[index];

  if (functions[token]) {
    const nextValue = parseFloat(parts[index + 1]);
    return {
      value: functions[token](nextValue),
      nextIndex: index + 2,
    };
  }

  return {
    value: parseFloat(token),
    nextIndex: index + 1,
  };
}

export function calculateExpression(expression) {
  const normalized = expression
    .replace(/sin-1/g, 'asin')
    .replace(/cos-1/g, 'acos')
    .replace(/tan-1/g, 'atan');

  const parts = normalized.split(" ").filter(Boolean);
  if (parts.length === 0) {
    return NaN;
  }

  const firstOperand = parseOperand(parts, 0);
  let result = firstOperand.value;
  let index = firstOperand.nextIndex;

  while (index < parts.length) {
    const op = parts[index];
    const nextOperand = parseOperand(parts, index + 1);
    const num = nextOperand.value;

    if (op === "+") result += num;
    if (op === "-") result -= num;
    if (op === "*") result *= num;
    if (op === "/") result /= num;

    index = nextOperand.nextIndex;
  }

  return result;
}
