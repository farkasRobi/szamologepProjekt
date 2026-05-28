const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const functionInput = document.getElementById('functionInput');
const displayText = document.getElementById('display');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');

let scale = 60;
let offsetX = 0;
let offsetY = 0;
let dragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let compiled = null;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = Math.max(320, window.innerHeight * 0.55);
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  draw();
}

function worldToScreenX(x) {
  return canvas.clientWidth / 2 + x * scale + offsetX;
}

function worldToScreenY(y) {
  const height = parseFloat(canvas.style.height);
  return height / 2 - y * scale + offsetY;
}

function screenToWorldX(px) {
  return (px - canvas.clientWidth / 2 - offsetX) / scale;
}

function screenToWorldY(py) {
  const height = parseFloat(canvas.style.height);
  return -(py - height / 2 - offsetY) / scale;
}

function drawGrid() {
  const width = canvas.clientWidth;
  const height = parseFloat(canvas.style.height);
  ctx.clearRect(0, 0, width, height);
  const step = scale;
  const centerX = worldToScreenX(0);
  const centerY = worldToScreenY(0);

  ctx.strokeStyle = 'rgba(127, 255, 0, 0.08)';
  ctx.lineWidth = 1;

  for (let x = centerX % step; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = centerY % step; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#4a6a20';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();

  ctx.fillStyle = '#7fff00';
  ctx.font = '12px Share Tech Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (let x = Math.floor(screenToWorldX(0)); x <= Math.ceil(screenToWorldX(width)); x++) {
    if (x === 0) continue;
    const sx = worldToScreenX(x);
    ctx.beginPath();
    ctx.moveTo(sx, centerY - 6);
    ctx.lineTo(sx, centerY + 6);
    ctx.stroke();
    ctx.fillText(x.toString(), sx, centerY + 8);
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (let y = Math.ceil(screenToWorldY(0)); y >= Math.floor(screenToWorldY(height)); y--) {
    if (y === 0) continue;
    const sy = worldToScreenY(y);
    ctx.beginPath();
    ctx.moveTo(centerX - 6, sy);
    ctx.lineTo(centerX + 6, sy);
    ctx.stroke();
    ctx.fillText(y.toString(), centerX + 8, sy);
  }
}

function drawFunction() {
  if (!compiled) return;
  const width = canvas.clientWidth;
  const height = parseFloat(canvas.style.height);
  ctx.strokeStyle = '#7fff00';
  ctx.lineWidth = 2;
  ctx.beginPath();

  let first = true;
  for (let px = 0; px <= width; px += 2) {
    const x = screenToWorldX(px);
    let y;
    try {
      y = compiled.evaluate({ x });
    } catch {
      first = true;
      continue;
    }
    if (!isFinite(y)) {
      first = true;
      continue;
    }
    const py = worldToScreenY(y);
    if (py < -500 || py > height + 500) {
      first = true;
      continue;
    }
    if (first) {
      ctx.moveTo(px, py);
      first = false;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
}

function draw() {
  drawGrid();
  drawFunction();
}

function updateGraph() {
  const expr = functionInput.value.trim();
  displayText.textContent = expr ? `y = ${expr}` : 'y = ...';
  try {
    compiled = math.compile(expr || '0');
    draw();
  } catch {
    ctx.clearRect(0, 0, canvas.clientWidth, parseFloat(canvas.style.height));
    drawGrid();
  }
}

function debounce(fn, delay = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  scale *= event.deltaY < 0 ? 1.1 : 0.9;
  draw();
});
canvas.addEventListener('mousedown', (event) => {
  dragging = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
});
window.addEventListener('mouseup', () => {
  dragging = false;
});
window.addEventListener('mousemove', (event) => {
  if (!dragging) return;
  offsetX += event.clientX - lastMouseX;
  offsetY += event.clientY - lastMouseY;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
  draw();
});

zoomIn.addEventListener('click', () => {
  scale *= 1.2;
  draw();
});
zoomOut.addEventListener('click', () => {
  scale *= 0.83;
  draw();
});

const backButton = document.getElementById("back-button");
backButton.addEventListener('click', () => {
    window.location.href = "index.html"
});
functionInput.addEventListener('input', debounce(updateGraph, 150));

resizeCanvas();
updateGraph();