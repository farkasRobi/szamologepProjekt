const functions = {
  sin: { fn: Math.sin, arity: 1 },
  cos: { fn: Math.cos, arity: 1 },
  tan: { fn: Math.tan, arity: 1 },
  asin: { fn: Math.asin, arity: 1 },
  acos: { fn: Math.acos, arity: 1 },
  atan: { fn: Math.atan, arity: 1 },
  log: { fn: (x) => Math.log10 ? Math.log10(x) : Math.log(x) / Math.LN10, arity: 1 },
  sqrt: { fn: Math.sqrt, arity: 1 },
  cbrt: { fn: Math.cbrt ? Math.cbrt : (x) => Math.sign(x) * Math.pow(Math.abs(x), 1 / 3), arity: 1 },
  pow: { fn: (x, y) => Math.pow(x, y), arity: 2 },
  root: { fn: (n, x) => Math.pow(x, 1 / n), arity: 2 },
  rand: { fn: () => Math.random(), arity: 0 },
};

const constants = {
  pi: Math.PI,
};

const operators = {
  '+': { precedence: 1, associativity: 'left', fn: (a, b) => a + b },
  '-': { precedence: 1, associativity: 'left', fn: (a, b) => a - b },
  '*': { precedence: 2, associativity: 'left', fn: (a, b) => a * b },
  '/': { precedence: 2, associativity: 'left', fn: (a, b) => a / b },
  '^': { precedence: 3, associativity: 'right', fn: (a, b) => Math.pow(a, b) },
};

function tokenize(expression) {
  const normalized = expression
    .replace(/sin-1/g, 'asin')
    .replace(/cos-1/g, 'acos')
    .replace(/tan-1/g, 'atan')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '');

  const tokenPattern = /asin|acos|atan|sin|cos|tan|log|sqrt|cbrt|pow|root|rand|pi|(?:\d*\.\d+|\d+)|[()+\-*/^,]/g;
  return normalized.match(tokenPattern) || [];
}

function isNumber(token) {
  return /^[0-9]+(\.[0-9]+)?$/.test(token);
}

function isFunction(token) {
  return Object.prototype.hasOwnProperty.call(functions, token);
}

function isOperator(token) {
  return Object.prototype.hasOwnProperty.call(operators, token);
}

function isConstant(token) {
  return Object.prototype.hasOwnProperty.call(constants, token);
}

function toRPN(tokens) {
  const output = [];
  const operatorStack = [];

  for (const token of tokens) {
    if (isNumber(token) || isConstant(token)) {
      output.push(token);
      continue;
    }

    if (isFunction(token)) {
      operatorStack.push(token);
      continue;
    }

    if (token === '(') {
      operatorStack.push(token);
      continue;
    }

    if (token === ',') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        output.push(operatorStack.pop());
      }
      if (operatorStack.length === 0) {
        throw new Error('Misplaced comma');
      }
      continue;
    }

    if (token === ')') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        output.push(operatorStack.pop());
      }
      operatorStack.pop();
      if (operatorStack.length > 0 && isFunction(operatorStack[operatorStack.length - 1])) {
        output.push(operatorStack.pop());
      }
      continue;
    }

    if (isOperator(token)) {
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (isOperator(top) && ((operators[token].associativity === 'left' && operators[token].precedence <= operators[top].precedence) || (operators[token].associativity === 'right' && operators[token].precedence < operators[top].precedence))) {
          output.push(operatorStack.pop());
          continue;
        }
        if (isFunction(top)) {
          output.push(operatorStack.pop());
          continue;
        }
        break;
      }
      operatorStack.push(token);
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop();
    if (top === '(' || top === ')') {
      throw new Error('Mismatched parentheses');
    }
    output.push(top);
  }

  return output;
}

function evaluateRPN(rpn) {
  const stack = [];

  for (const token of rpn) {
    if (isNumber(token)) {
      stack.push(parseFloat(token));
      continue;
    }

    if (isConstant(token)) {
      stack.push(constants[token]);
      continue;
    }

    if (isOperator(token)) {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(operators[token].fn(a, b));
      continue;
    }

    if (isFunction(token)) {
      const { fn, arity } = functions[token];
      if (arity === 0) {
        stack.push(fn());
      } else if (arity === 1) {
        const value = stack.pop();
        stack.push(fn(value));
      } else if (arity === 2) {
        const b = stack.pop();
        const a = stack.pop();
        stack.push(fn(a, b));
      }
      continue;
    }

    throw new Error(`Unexpected token: ${token}`);
  }

  return stack.length === 1 ? stack[0] : NaN;
}

export function calculateExpression(expression) {
  try {
    const tokens = tokenize(expression);
    if (tokens.length === 0) {
      return NaN;
    }

    const rpn = toRPN(tokens);
    return evaluateRPN(rpn);
  } catch (error) {
    return NaN;
  }
}
