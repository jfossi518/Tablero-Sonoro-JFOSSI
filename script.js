const canvas = document.getElementById('pizarra');
const ctx = canvas.getContext('2d');
let dibujando = false;
let lastX = 0;
let lastY = 0;
let hue = 0;

// Web Audio API setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillator = null;
let gainNode = audioCtx.createGain();
gainNode.connect(audioCtx.destination);
gainNode.gain.value = 0;

function startSound(frequency) {
  oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  oscillator.connect(gainNode);
  oscillator.start();
  gainNode.gain.value = 0.15;
}

function updateSound(frequency) {
  if (oscillator) {
    oscillator.frequency.value = frequency;
  }
}

function stopSound() {
  if (oscillator) {
    gainNode.gain.value = 0;
    oscillator.stop();
    oscillator.disconnect();
    oscillator = null;
  }
}

canvas.addEventListener('mousedown', (e) => {
  dibujando = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  const freq = mapYToFreq(lastY);
  startSound(freq);
});

canvas.addEventListener('mousemove', (e) => {
  if (!dibujando) return;
  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
  hue = (hue + 3) % 360;
  const freq = mapYToFreq(lastY);
  updateSound(freq);
});

canvas.addEventListener('mouseup', () => {
  dibujando = false;
  stopSound();
});
canvas.addEventListener('mouseleave', () => {
  dibujando = false;
  stopSound();
});

function mapYToFreq(y) {
  // Mapea la posición Y a un rango de frecuencia audible (220Hz a 1200Hz)
  const minFreq = 220;
  const maxFreq = 1200;
  return minFreq + ((canvas.height - y) / canvas.height) * (maxFreq - minFreq);
}

// Opcional: limpiar pizarra con doble click
canvas.addEventListener('dblclick', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
