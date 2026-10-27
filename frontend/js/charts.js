/**
 * =========================================================================
 * BAYORA CHARTS ENGINE
 * Lightweight, high-DPI HTML5 Canvas Chart Renderers
 * Zero external libraries required. Crisp, dark cybersecurity aesthetic.
 * =========================================================================
 */

export function renderBarChart(canvasId, data, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => d.value), 10);
  const barWidth = Math.min(chartW / data.length - 16, 44);

  // Draw Grid Lines
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1;
  const gridLines = 4;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    // Value Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "10px JetBrains Mono, monospace";
    ctx.textAlign = "right";
    const val = Math.round(maxVal - (maxVal / gridLines) * i);
    ctx.fillText(val, padding.left - 8, y + 3);
  }

  // Draw Bars
  data.forEach((item, index) => {
    const x = padding.left + (chartW / data.length) * index + (chartW / data.length - barWidth) / 2;
    const barH = (item.value / maxVal) * chartH;
    const y = padding.top + chartH - barH;

    // Gradient bar
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, item.color || "#0284c7");
    grad.addColorStop(1, item.colorEnd || "#0f172a");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Value above bar
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(item.value, x + barWidth / 2, y - 6);

    // Category Label below
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "center";
    const label = item.label.length > 10 ? item.label.slice(0, 9) + "…" : item.label;
    ctx.fillText(label, x + barWidth / 2, height - padding.bottom + 18);
  });
}

export function renderGaugeChart(canvasId, percentage, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const cx = rect.width / 2;
  const cy = rect.height / 2 + 10;
  const radius = Math.min(rect.width, rect.height) / 2 - 16;

  ctx.clearRect(0, 0, rect.width, rect.height);

  // Background Arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI * 0.8, Math.PI * 2.2, false);
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.stroke();

  // Active Value Arc
  const endAngle = Math.PI * 0.8 + (percentage / 100) * (Math.PI * 1.4);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI * 0.8, endAngle, false);
  ctx.strokeStyle = options.color || "#10b981";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.stroke();

  // Central Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 22px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${percentage}%`, cx, cy - 2);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "11px Inter, sans-serif";
  ctx.fillText(options.label || "DEFENSE EFFICACY", cx, cy + 18);
}
