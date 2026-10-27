/**
 * =========================================================================
 * BAYORA CHARTS ENGINE
 * Lightweight, high-DPI HTML5 Canvas Chart Renderers
 * Zero external libraries required. Theme-adaptive cybersecurity visualization.
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

  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const gridColor = isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.08)";
  const labelColor = isLight ? "#475569" : "#94a3b8";
  const textColor = isLight ? "#0f172a" : "#f8fafc";
  const valueColor = isLight ? "#64748b" : "#64748b";

  const padding = { top: 24, right: 20, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => d.value), 10);
  const barWidth = Math.min(chartW / data.length - 16, 44);

  // Draw Grid Lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  const gridLines = 4;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    // Value Labels
    ctx.fillStyle = valueColor;
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
    grad.addColorStop(0, item.color || (isLight ? "#0284c7" : "#38bdf8"));
    grad.addColorStop(1, item.colorEnd || (isLight ? "#0369a1" : "#0f172a"));

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
    ctx.fill();

    // Value above bar
    ctx.fillStyle = textColor;
    ctx.font = "700 11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(item.value, x + barWidth / 2, y - 6);

    // Category Label below
    ctx.fillStyle = labelColor;
    ctx.font = "600 11px Inter, sans-serif";
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

  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const bgArcColor = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.1)";
  const textColor = isLight ? "#0f172a" : "#f8fafc";
  const labelColor = isLight ? "#64748b" : "#94a3b8";

  // Background Arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI * 0.8, Math.PI * 2.2, false);
  ctx.strokeStyle = bgArcColor;
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.stroke();

  // Active Value Arc
  const endAngle = Math.PI * 0.8 + (percentage / 100) * (Math.PI * 1.4);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI * 0.8, endAngle, false);
  ctx.strokeStyle = options.color || (isLight ? "#059669" : "#10b981");
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.stroke();

  // Central Text
  ctx.fillStyle = textColor;
  ctx.font = "800 24px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${percentage}%`, cx, cy - 2);

  ctx.fillStyle = labelColor;
  ctx.font = "600 11px Inter, sans-serif";
  ctx.fillText(options.label || "DEFENSE EFFICACY", cx, cy + 18);
}
