import { all, create } from 'mathjs';

const math = create(all);

function integrateNode(node, variable) {
  if (node.type === 'ConstantNode') {
    return `${node.value} * ${variable}`;
  }

  if (node.type === 'SymbolNode') {
    if (node.name === variable) {
      return `${variable}^2 / 2`;
    }
    return `${node.name} * ${variable}`;
  }

  if (node.type === 'OperatorNode') {
    if (node.op === '+') {
      return `(${integrateNode(node.args[0], variable)}) + (${integrateNode(node.args[1], variable)})`;
    }

    if (node.op === '-') {
      if (node.args.length === 1) {
        return `-(${integrateNode(node.args[0], variable)})`;
      }
      return `(${integrateNode(node.args[0], variable)}) - (${integrateNode(node.args[1], variable)})`;
    }

    if (node.op === '*') {
      const constantNode = node.args.find((arg) => arg.type === 'ConstantNode');
      if (constantNode) {
        const otherNode = node.args.find((arg) => arg !== constantNode);
        return `${constantNode.value} * (${integrateNode(otherNode, variable)})`;
      }
    }

    if (node.op === '^') {
      const exponentNode = node.args[1];
      if (exponentNode.type === 'ConstantNode') {
        const exponent = Number(exponentNode.value);
        if (Number.isInteger(exponent)) {
          if (exponent === -1) {
            return `log(${variable})`;
          }
          const newExponent = exponent + 1;
          return `${variable}^${newExponent} / ${newExponent}`;
        }
      }
    }
  }

  return `integral(${node.toString()}, ${variable})`;
}

export function parseNumberList(text) {
  return text
    .split(/[,;\n]+/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
}

export function differentiate(expression, variable = 'x') {
  return math.derivative(expression, variable).toString();
}

export function integrateIndefinite(expression, variable = 'x') {
  const parsed = math.parse(expression);
  return integrateNode(parsed, variable).replace(/\s+/g, ' ').trim();
}

export function integrateDefinite(expression, variable = 'x', lowerBound = 0, upperBound = 1) {
  const antiderivative = integrateIndefinite(expression, variable);
  return math.evaluate(antiderivative, { [variable]: upperBound }) - math.evaluate(antiderivative, { [variable]: lowerBound });
}

export function solveQuadratic(a, b, c) {
  const discriminant = b * b - 4 * a * c;

  if (discriminant >= 0) {
    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    return [root1, root2].sort((left, right) => left - right).map((value) => value.toString());
  }

  const real = -b / (2 * a);
  const imag = Math.sqrt(-discriminant) / (2 * a);
  return [
    `${real.toFixed(10)} + ${imag.toFixed(10)}i`,
    `${real.toFixed(10)} - ${imag.toFixed(10)}i`,
  ];
}

function cbrt(value) {
  const abs = Math.abs(value);
  const sign = Math.sign(value);
  return sign * Math.pow(abs, 1 / 3);
}

export function solveCubic(a, b, c, d) {
  const normalized = [a, b, c, d].map(Number);
  if (normalized[0] === 0) {
    return solveQuadratic(normalized[1], normalized[2], normalized[3]);
  }

  const A = normalized[1] / normalized[0];
  const B = normalized[2] / normalized[0];
  const C = normalized[3] / normalized[0];

  const p = B - (A * A) / 3;
  const q = (2 * A * A * A) / 27 - (A * B) / 3 + C;
  const discriminant = (q / 2) ** 2 + (p / 3) ** 3;

  if (discriminant > 0) {
    const u = cbrt(-q / 2 + Math.sqrt(discriminant));
    const v = cbrt(-q / 2 - Math.sqrt(discriminant));
    const y = u + v;
    return [(y - A / 3).toString()];
  }

  if (Math.abs(discriminant) < 1e-12) {
    const u = cbrt(-q / 2);
    const y = 2 * u;
    const root = y - A / 3;
    return [root.toString(), root.toString()];
  }

  const r = Math.sqrt(-(p ** 3) / 27);
  const phi = Math.acos((-q / 2) / r);
  const t = 2 * Math.sqrt(-p / 3);
  const roots = [
    t * Math.cos(phi / 3) - A / 3,
    t * Math.cos((phi + 2 * Math.PI) / 3) - A / 3,
    t * Math.cos((phi + 4 * Math.PI) / 3) - A / 3,
  ];

  return roots.map((value) => value.toString()).sort((left, right) => Number(left) - Number(right));
}

export function standardDeviation(values) {
  const mean = values.reduce((acc, value) => acc + value, 0) / values.length;
  const variance = values.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

export function sequenceNthTerm(type, firstTerm, step, n) {
  if (type === 'arithmetic') {
    return firstTerm + (n - 1) * step;
  }

  return firstTerm * Math.pow(step, n - 1);
}

export function sequenceSum(type, firstTerm, step, n) {
  if (type === 'arithmetic') {
    return (n / 2) * (2 * firstTerm + (n - 1) * step);
  }

  if (Math.abs(step) === 1) {
    return n * firstTerm;
  }

  return firstTerm * (Math.pow(step, n) - 1) / (step - 1);
}

export function quartiles(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = math.quantileSeq(sorted, 0.25);
  const q2 = math.quantileSeq(sorted, 0.5);
  const q3 = math.quantileSeq(sorted, 0.75);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  return {
    min,
    max,
    range: max - min,
    q1,
    q2,
    q3,
  };
}
