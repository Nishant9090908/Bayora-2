/**
 * =========================================================================
 * BAYORA CHARTS ENGINE - BLACK, WHITE & ORANGE ARCHITECTURAL SYSTEM
 * High-DPI HTML5 Canvas Chart Renderers with Smooth Spring Animations
 * Strict Palette: Black (#000000), White (#ffffff), and Orange (#ff5500)
 * =========================================================================
 */

// Track active animation frame IDs to cancel overlapping animations cleanly
const activeAnimations = new Map();

/**
 * Animated High-DPI Bar Chart with Ease-Out Curve & Interactive HUD Tooltips
 */
export function renderBarChart(canvasId, data, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  // Cancel any running animation on this canvas
  if (activeAnimations.has(canvasId)) {
    cancelAnimationFrame(activeAnimations.get(canvasId));
    activeAnimations.delete(canvasId);
  }

  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 480;
  const height = rect.height || 220;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const padding = { top: 28, right: 24, bottom: 42, left: 52 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => d.value), 10);
  const totalVal = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const barWidth = Math.min(chartW / data.length - 18, 48);

  // Theme Palette: Check if blue theme is requested
  const isBlueTheme = options.theme === "blue" || options.accentColor === "#0ea5e9" || (data[0] && (data[0].colorEnd === "#0284c7" || data[0].color === "#38bdf8"));
  const gridColor = "rgba(255, 255, 255, 0.08)";
  const labelColor = "#a0a0a0";
  const textColor = "#ffffff";
  const accentColor = options.accentColor || (isBlueTheme ? "#0ea5e9" : "#ff5500");
  const accentGlow = isBlueTheme ? "rgba(14, 165, 233, 0.5)" : "rgba(255, 85, 0, 0.4)";
  const ambientGlow = isBlueTheme ? "rgba(14, 165, 233, 0.25)" : "rgba(255, 85, 0, 0.2)";

  // Mouse hover state tracking
  let hoveredIndex = -1;

  function handleMouseMove(e) {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;

    let found = -1;
    data.forEach((item, index) => {
      const x = padding.left + (chartW / data.length) * index + (chartW / data.length - barWidth) / 2;
      const barH = (item.value / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      if (mx >= x && mx <= x + barWidth && my >= y - 10 && my <= padding.top + chartH) {
        found = index;
      }
    });

    if (found !== hoveredIndex) {
      hoveredIndex = found;
      canvas.style.cursor = found !== -1 ? "pointer" : "default";
      drawFrame(1); // Redraw at full height with hover state
    }
  }

  canvas.onmousemove = handleMouseMove;
  canvas.onmouseleave = () => {
    if (hoveredIndex !== -1) {
      hoveredIndex = -1;
      canvas.style.cursor = "default";
      drawFrame(1);
    }
  };

  // Ease Out Cubic function
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // Animation Loop
  const duration = options.duration || 750;
  let startTime = null;

  function drawFrame(progress) {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Architectural Tech Grid Lines
    ctx.lineWidth = 1;
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.strokeStyle = gridColor;
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Value label on Y-axis
      ctx.fillStyle = "#666666";
      ctx.font = "700 10px 'Space Mono', monospace";
      ctx.textAlign = "right";
      const val = Math.round(maxVal - (maxVal / gridLines) * i);
      ctx.fillText(val, padding.left - 10, y + 3);
    }

    // 2. Draw Animated Bars
    data.forEach((item, index) => {
      const isHovered = hoveredIndex === index;
      const x = padding.left + (chartW / data.length) * index + (chartW / data.length - barWidth) / 2;
      const fullBarH = (item.value / maxVal) * chartH;
      const barH = Math.max(fullBarH * progress, 3);
      const y = padding.top + chartH - barH;

      ctx.save();

      // Bar Glow
      if (isHovered) {
        ctx.shadowColor = accentGlow;
        ctx.shadowBlur = 20;
      } else {
        ctx.shadowColor = ambientGlow;
        ctx.shadowBlur = 8;
      }

      // Vertical Bar Gradient (Black, White & Orange/Blue)
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      if (isHovered) {
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.3, isBlueTheme ? "#38bdf8" : "#ff6c1f");
        grad.addColorStop(1, isBlueTheme ? "#0284c7" : "#992200");
      } else {
        grad.addColorStop(0, item.color || accentColor);
        grad.addColorStop(0.5, item.colorEnd || (isBlueTheme ? "#0284c7" : "#d94400"));
        grad.addColorStop(1, isBlueTheme ? "#02121f" : "#0a0a0a");
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Top Highlight Cap Line
      ctx.fillStyle = isHovered ? "#ffffff" : (item.color || accentColor);
      ctx.fillRect(x, y, barWidth, 2);

      ctx.restore();

      // Value above bar (reveals as progress completes)
      if (progress > 0.4) {
        const textAlpha = Math.min((progress - 0.4) / 0.6, 1);
        ctx.save();
        ctx.globalAlpha = textAlpha;
        ctx.fillStyle = isHovered ? accentColor : textColor;
        ctx.font = "700 11px 'Space Mono', monospace";
        ctx.textAlign = "center";
        const animatedVal = Math.round(item.value * progress);
        ctx.fillText(animatedVal, x + barWidth / 2, y - 7);
        ctx.restore();
      }

      // Category Label below X-axis
      ctx.fillStyle = isHovered ? accentColor : labelColor;
      ctx.font = "600 11px 'Inter', sans-serif";
      ctx.textAlign = "center";
      const label = item.label.length > 11 ? item.label.slice(0, 10) + "…" : item.label;
      ctx.fillText(label, x + barWidth / 2, height - padding.bottom + 18);
    });

    // 3. Draw Cyber Tooltip on Hover
    if (hoveredIndex !== -1 && data[hoveredIndex]) {
      const item = data[hoveredIndex];
      const pct = Math.round((item.value / totalVal) * 100);
      const hx = padding.left + (chartW / data.length) * hoveredIndex + (chartW / data.length) / 2;
      const hy = padding.top + chartH - (item.value / maxVal) * chartH - 24;

      ctx.save();
      const tipText = `${item.label}: ${item.value} (${pct}%)`;
      ctx.font = "700 10px 'Space Mono', monospace";
      const textW = ctx.measureText(tipText).width;
      const tipW = textW + 16;
      const tipH = 22;
      const tipX = Math.max(10, Math.min(width - tipW - 10, hx - tipW / 2));

      ctx.fillStyle = "#0c0c0c";
      ctx.strokeStyle = item.colorEnd || accentColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tipX, hy - tipH, tipW, tipH, [3, 3, 3, 3]);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(tipText, tipX + tipW / 2, hy - 7);
      ctx.restore();
    }
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    const progress = easeOutCubic(rawProgress);

    drawFrame(progress);

    if (rawProgress < 1) {
      const frameId = requestAnimationFrame(animate);
      activeAnimations.set(canvasId, frameId);
    } else {
      activeAnimations.delete(canvasId);
    }
  }

  const frameId = requestAnimationFrame(animate);
  activeAnimations.set(canvasId, frameId);
}

/**
 * Animated High-DPI Circular Gauge with Sweeping Arc & Digital Number Ticking
 */
export function renderGaugeChart(canvasId, percentage, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  if (activeAnimations.has(canvasId)) {
    cancelAnimationFrame(activeAnimations.get(canvasId));
    activeAnimations.delete(canvasId);
  }

  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 220;
  const height = rect.height || 180;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const cx = width / 2;
  const cy = height / 2 + 12;
  const radius = Math.min(width, height) / 2 - 20;

  const orangeAccent = options.color || "#ff5500";
  const bgArcColor = "rgba(255, 255, 255, 0.08)";
  const duration = options.duration || 850;
  let startTime = null;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function drawGaugeFrame(progress) {
    ctx.clearRect(0, 0, width, height);

    // 1. Background Inactive Arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI * 0.8, Math.PI * 2.2, false);
    ctx.strokeStyle = bgArcColor;
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.stroke();

    // 2. Active Animated Sweeping Arc
    const currentPct = percentage * progress;
    const endAngle = Math.PI * 0.8 + (currentPct / 100) * (Math.PI * 1.4);

    ctx.save();
    ctx.shadowColor = "rgba(255, 85, 0, 0.5)";
    ctx.shadowBlur = 16;

    const grad = ctx.createLinearGradient(0, cy - radius, width, cy + radius);
    grad.addColorStop(0, "#ff8800");
    grad.addColorStop(1, orangeAccent);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI * 0.8, endAngle, false);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    // 3. Central Animated Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 28px 'Chakra Petch', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${currentPct.toFixed(1)}%`, cx, cy - 2);

    // 4. Subtitle
    ctx.fillStyle = "#a0a0a0";
    ctx.font = "700 10px 'Space Mono', monospace";
    ctx.fillText(options.label || "DEFENSE EFFICACY", cx, cy + 22);
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    const progress = easeOutCubic(rawProgress);

    drawGaugeFrame(progress);

    if (rawProgress < 1) {
      const frameId = requestAnimationFrame(animate);
      activeAnimations.set(canvasId, frameId);
    } else {
      activeAnimations.delete(canvasId);
    }
  }

  const frameId = requestAnimationFrame(animate);
  activeAnimations.set(canvasId, frameId);
}

/**
 * Animated High-DPI Stepped Line Chart (Staircase Chart matching Efferd UI)
 */
export function renderSteppedLineChart(canvasId, series = [], dates = ['Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12', 'Apr 13'], options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  if (activeAnimations.has(canvasId)) {
    cancelAnimationFrame(activeAnimations.get(canvasId));
    activeAnimations.delete(canvasId);
  }

  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 480;
  const height = rect.height || 220;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const padding = { top: 28, right: 24, bottom: 36, left: 24 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Default series if empty
  const activeSeries = series.length > 0 ? series : [
    { label: "Bypass Probes", data: [40, 55, 55, 75, 75, 90, 95], color: "#ffffff" },
    { label: "Filtered Vectors", data: [20, 32, 48, 48, 62, 62, 70], color: "#ff5500" }
  ];

  let maxVal = 100;
  activeSeries.forEach(s => {
    s.data.forEach(v => {
      if (v > maxVal) maxVal = v;
    });
  });

  const duration = options.duration || 800;
  let startTime = null;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function drawSteppedFrame(progress) {
    ctx.clearRect(0, 0, width, height);

    // Subtle horizontal grid line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartH / 2);
    ctx.lineTo(width - padding.right, padding.top + chartH / 2);
    ctx.stroke();

    // Draw Stepped Lines for each series
    activeSeries.forEach((s) => {
      const pts = s.data;
      if (pts.length < 2) return;

      const stepX = chartW / (pts.length - 1);

      ctx.save();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.lineJoin = "miter";
      ctx.beginPath();

      const totalSteps = pts.length - 1;
      const currentStepProgress = progress * totalSteps;

      const startY = padding.top + chartH - (pts[0] / maxVal) * chartH;
      ctx.moveTo(padding.left, startY);

      for (let i = 0; i < totalSteps; i++) {
        if (progress * totalSteps < i) break;

        const x0 = padding.left + i * stepX;
        const y0 = padding.top + chartH - (pts[i] / maxVal) * chartH;
        const x1 = padding.left + (i + 1) * stepX;
        const y1 = padding.top + chartH - (pts[i + 1] / maxVal) * chartH;

        if (currentStepProgress >= i + 1) {
          // Full step
          ctx.lineTo(x1, y0);
          ctx.lineTo(x1, y1);
        } else {
          // Partial step
          const localT = currentStepProgress - i;
          if (localT < 0.5) {
            const curX = x0 + (x1 - x0) * (localT * 2);
            ctx.lineTo(curX, y0);
          } else {
            ctx.lineTo(x1, y0);
            const curY = y0 + (y1 - y0) * ((localT - 0.5) * 2);
            ctx.lineTo(x1, curY);
          }
        }
      }

      ctx.stroke();

      // Subtle glow shadow
      ctx.shadowColor = s.color === "#ff5500" ? "rgba(255, 85, 0, 0.3)" : (s.color.startsWith("#0") || s.color.startsWith("#3") ? "rgba(14, 165, 233, 0.4)" : "rgba(255, 255, 255, 0.2)");
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.restore();
    });

    // Draw X-axis Date Labels (Apr 7 - Apr 13)
    ctx.fillStyle = "#666666";
    ctx.font = "500 11px 'Inter', sans-serif";
    ctx.textAlign = "center";
    const dateCount = dates.length;
    dates.forEach((d, i) => {
      const x = padding.left + (chartW / (dateCount - 1)) * i;
      ctx.fillText(d, x, height - padding.bottom + 20);
    });
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    const progress = easeOutCubic(rawProgress);

    drawSteppedFrame(progress);

    if (rawProgress < 1) {
      const frameId = requestAnimationFrame(animate);
      activeAnimations.set(canvasId, frameId);
    } else {
      activeAnimations.delete(canvasId);
    }
  }

  const frameId = requestAnimationFrame(animate);
  activeAnimations.set(canvasId, frameId);
}
