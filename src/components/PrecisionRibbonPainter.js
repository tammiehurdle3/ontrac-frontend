// Precision Ribbon: the road is deposited BEHIND the courier, never pre-drawn.
// Adapted from the approved Folded Mile precision study to the real responsive hero.
const clamp = n => Math.min(1, Math.max(0, n));
const ease = n => { const x = clamp(n); return x * x * (3 - 2 * x); };
const phase = (t, a, b) => ease((t - a) / (b - a));
const legs = [[240, 1530], [1530, 2960], [2960, 4250]];

const sample = (path, length, f) => {
  const pos = path.getPointAtLength(Math.max(0, Math.min(length, f * length)));
  const prev = path.getPointAtLength(Math.max(0, f * length - 2));
  const next = path.getPointAtLength(Math.min(length, f * length + 2));
  const a = Math.atan2(next.y - prev.y, next.x - prev.x);
  return { x: pos.x, y: pos.y, nx: -Math.sin(a), ny: Math.cos(a), a };
};

const rail = (ctx, path, len, start, end, offset, color, width, alpha) => {
  if (alpha <= 0 || end <= start) return;
  const steps = Math.max(5, Math.ceil((end - start) * len / 5));
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const p = sample(path, len, start + (end - start) * i / steps);
    const x = p.x + p.nx * offset, y = p.y + p.ny * offset;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
};

export function sizeRibbonCanvas(canvas, host) {
  if (!canvas || !host) return;
  const rect = host.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  const ctx = canvas.getContext('2d', { alpha: true });
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function drawPrecisionRibbon(canvas, paths, lengths, timeMs) {
  const ctx = canvas?.getContext('2d');
  if (!ctx || paths.some((path, i) => !path || !lengths[i])) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  const intro = phase(timeMs, 120, 530);
  const vanish = 1 - phase(timeMs, 4140, 4940);
  const alpha = intro * vanish;
  if (alpha < .005) return;
  const mobile = canvas.clientWidth < 620;
  const w = mobile ? 4.6 : 5;
  const q = legs.map(([a,b]) => phase(timeMs, a, b));
  const active = timeMs < legs[1][0] ? 0 : timeMs < legs[2][0] ? 1 : 2;

  // Two quiet, engineered edges. Completed legs retire before accumulating.
  for (let i = 0; i < 3; i++) {
    const end = Math.max(0, q[i] - .016);
    if (end < .005) continue;
    const elapsed = Math.max(0, timeMs - legs[i][1]);
    const retiring = i === active ? 1 : (1 - phase(elapsed, 0, 600));
    const opacity = alpha * .57 * retiring;
    if (opacity < .005) continue;
    const start = Math.max(0, end - .26);
    rail(ctx, paths[i], lengths[i], start, end, -w, '#889BA4', 1, opacity * .73);
    rail(ctx, paths[i], lengths[i], start, end, w, '#B6C4CA', .8, opacity * .64);
    rail(ctx, paths[i], lengths[i], start, end, 0, '#E7ECEB', w * 1.33, opacity * .22);
    // Sparse physical joints. They occur only after the lead has passed them.
    for (const j of [2, 5, 8]) {
      const u = j / 10;
      if (u < start || u > end) continue;
      const p = sample(paths[i], lengths[i], u);
      ctx.beginPath();
      ctx.moveTo(p.x - p.nx * w, p.y - p.ny * w);
      ctx.lineTo(p.x + p.nx * w, p.y + p.ny * w);
      ctx.globalAlpha = opacity * .70;
      ctx.strokeStyle = '#85959F';
      ctx.lineWidth = .85;
      ctx.stroke();
    }
  }
  const path = paths[active], len = lengths[active], pos = sample(path, len, q[active]);
  const rear = sample(path, len, Math.max(0, q[active] - .023));
  ctx.beginPath();
  ctx.moveTo(rear.x - rear.nx * w, rear.y - rear.ny * w);
  ctx.lineTo(rear.x + rear.nx * w, rear.y + rear.ny * w);
  ctx.lineTo(pos.x + pos.nx * w * .20, pos.y + pos.ny * w * .20);
  ctx.lineTo(pos.x - pos.nx * w * .20, pos.y - pos.ny * w * .20);
  ctx.closePath();
  ctx.globalAlpha = alpha * .85;
  ctx.fillStyle = '#C7D0D1';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(rear.x - rear.nx * w, rear.y - rear.ny * w);
  ctx.lineTo(rear.x + rear.nx * w, rear.y + rear.ny * w);
  ctx.globalAlpha = alpha * .61;
  ctx.strokeStyle = '#8699A1';
  ctx.lineWidth = .95;
  ctx.stroke();

  // Tiny red beveled courier, the only saturated moving element.
  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(pos.a);
  const L = (mobile ? 1.13 : 1) * 12.6, H = 2.6;
  ctx.globalAlpha = alpha;
  ctx.shadowColor = 'rgba(174,33,46,.19)';
  ctx.shadowBlur = 5;
  ctx.fillStyle = '#C92634';
  ctx.beginPath();
  ctx.moveTo(-L * .72, -H);
  ctx.lineTo(L * .38, -H);
  ctx.lineTo(L * .77, 0);
  ctx.lineTo(L * .38, H);
  ctx.lineTo(-L * .72, H);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.fillRect(-L * .35, -.45, L * .22, .9);
  ctx.restore();
  ctx.globalAlpha = 1;
}
